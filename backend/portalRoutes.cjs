module.exports = function registerPortalRoutes(app, prisma, authenticateToken, bcrypt) {
  app.get('/api/reports/activity', authenticateToken, async (req, res) => {
    if (req.user.role !== 'SUPER_ADMIN') return res.status(403).json({ error: 'Only Super Admins can view system activity' });
    try { const take = req.query?.all === 'true' ? 100 : 10; res.json(await prisma.systemLog.findMany({ orderBy: { timestamp: 'desc' }, take })); }
    catch { res.status(500).json({ error: 'Unable to load system activity' }); }
  });
  app.get('/api/users/preferences', authenticateToken, async (req, res) => {
    try { const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { preferences: true } }); if (!user) return res.status(404).json({ error: 'User not found' }); res.json(user.preferences || {}); }
    catch { res.status(500).json({ error: 'Unable to load preferences' }); }
  });
  app.put('/api/users/preferences', authenticateToken, async (req, res) => {
    const { emailNotifications, taskNotifications } = req.body;
    if (typeof emailNotifications !== 'boolean' || typeof taskNotifications !== 'boolean') return res.status(400).json({ error: 'Invalid notification preferences' });
    try { const user = await prisma.user.update({ where: { id: req.user.id }, data: { preferences: { emailNotifications, taskNotifications } } }); res.json(user.preferences); }
    catch { res.status(500).json({ error: 'Unable to save preferences' }); }
  });
  app.post('/api/auth/update-password', authenticateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string' || newPassword.length < 8 || Buffer.byteLength(newPassword, 'utf8') > 72) return res.status(400).json({ error: 'Use a password with at least 8 characters and at most 72 bytes' });
    try {
      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) return res.status(400).json({ error: 'Current password is incorrect' });
      await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(newPassword, 10) } });
      res.json({ success: true });
    } catch { res.status(500).json({ error: 'Unable to update password' }); }
  });
  app.get('/api/leaves', authenticateToken, async (req, res) => {
    try {
      const where = req.user.role === 'INTERN' ? { internId: req.user.id } : req.user.role === 'MENTOR' ? { intern: { mentorId: req.user.id } } : {};
      const leaves = await prisma.leaveRequest.findMany({ where, orderBy: { createdAt: 'desc' }, include: { intern: { select: { id: true, name: true } } } });
      res.json(leaves);
    } catch { res.status(500).json({ error: 'Unable to load leave requests' }); }
  });
  app.post('/api/leaves', authenticateToken, async (req, res) => {
    if (req.user.role !== 'INTERN') return res.status(403).json({ error: 'Only interns can request leave' });
    const { type, from, to, reason } = req.body;
    const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
    if (!['Sick Leave', 'Casual Leave', 'Emergency Leave'].includes(type) || !validDate(from) || !validDate(to) || to < from || typeof reason !== 'string' || !reason.trim() || reason.length > 2000) return res.status(400).json({ error: 'Provide a leave type, valid date range, and reason' });
    const days = Math.round((Date.parse(to) - Date.parse(from)) / 86400000) + 1;
    if (days > 365) return res.status(400).json({ error: 'Leave requests cannot exceed 365 days' });
    try { const leave = await prisma.leaveRequest.create({ data: { internId: req.user.id, type, from, to, reason: reason.trim(), days } }); res.status(201).json(leave); }
    catch { res.status(500).json({ error: 'Unable to submit leave request' }); }
  });
  app.put('/api/leaves/:id/status', authenticateToken, async (req, res) => {
    if (!['MENTOR', 'SUPER_ADMIN'].includes(req.user.role)) return res.status(403).json({ error: 'Only mentors can review leave requests' });
    if (!['APPROVED', 'REJECTED'].includes(req.body.status)) return res.status(400).json({ error: 'Invalid leave status' });
    try {
      const leave = await prisma.leaveRequest.findUnique({ where: { id: req.params.id }, include: { intern: { select: { mentorId: true } } } });
      if (!leave) return res.status(404).json({ error: 'Leave request not found' });
      if (req.user.role === 'MENTOR' && leave.intern.mentorId !== req.user.id) return res.status(403).json({ error: 'This intern is not assigned to you' });
      res.json(await prisma.leaveRequest.update({ where: { id: leave.id }, data: { status: req.body.status } }));
    } catch { res.status(500).json({ error: 'Unable to review leave request' }); }
  });
};
