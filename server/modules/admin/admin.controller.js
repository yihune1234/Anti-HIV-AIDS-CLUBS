const User = require('../../models/User');
const Event = require('../../models/Event');
const PeerEducationSession = require('../../models/PeerEducationSession');
const Story = require('../../models/Story');
const Resource = require('../../models/Resource');
const Gallery = require('../../models/Gallery');
const SystemSettings = require('../../models/SystemSettings');
const Member = require('../../models/Member');

// User Management
// ... existing exports ...

// Add this at the end of the file
exports.getAllMemberContacts = async (req, res) => {
  try {
    const members = await Member.find()
      .populate('user', 'firstName lastName email phoneNumbers profileImage')
      .sort({ createdAt: -1 });

    const contactList = members.map(member => ({
      memberId: member._id,
      studentId: member.studentId,
      fullName: member.user ? `${member.user.firstName} ${member.user.lastName}` : 'N/A',
      email: member.user ? member.user.email : 'N/A',
      phone: member.user && member.user.phoneNumbers && member.user.phoneNumbers.length > 0
        ? member.user.phoneNumbers.find(p => p.isPrimary)?.number || member.user.phoneNumbers[0].number
        : 'N/A',
      department: member.department,
      position: member.position,
      membershipStatus: member.membershipStatus
    }));

    res.status(200).json({
      success: true,
      data: contactList
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Public Settings
exports.getPublicSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.findOne();
    if (!settings) {
      return res.status(200).json({
        success: true,
        data: {
          siteName: 'Haramaya University Anti-HIV/AIDS Club',
          contactEmail: 'anti-hiv-club@haramaya.edu.et',
          contactPhone: '+251 25 553 0334',
          leadership: { presidentName: 'Yihune Belay' },
          socialMedia: {}
        }
      });
    }

    // Only return public fields
    const publicSettings = {
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      siteLogo: settings.siteLogo,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      leadership: settings.leadership,
      socialMedia: settings.socialMedia,
      features: settings.features
    };

    res.status(200).json({
      success: true,
      data: publicSettings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// User Management
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, status, search } = req.query;
    const query = {};

    if (role) query.roles = role;
    if (status) query.membershipStatus = status;
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('eventsAttended.event')
      .populate('sessionsAttended.session');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUserRoles = async (req, res) => {
  try {
    const { roles } = req.body;

    if (!roles || !Array.isArray(roles)) {
      return res.status(400).json({ success: false, message: 'Roles must be an array' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { roles },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { membershipStatus, isActive } = req.body;
    const updateData = {};

    if (membershipStatus) updateData.membershipStatus = membershipStatus;
    if (isActive !== undefined) updateData.isActive = isActive;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Event Attendance Management
exports.getEventAttendees = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate({
        path: 'registrations.user',
        select: 'username email firstName lastName department year profileImage'
      });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        event: {
          id: event._id,
          title: event.title,
          startDate: event.startDate,
          endDate: event.endDate
        },
        attendees: event.registrations
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { attended } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const registration = event.registrations.find(
      r => r.user.toString() === req.params.userId
    );

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    registration.attended = attended;
    await event.save();

    // Update user's eventsAttended
    const user = await User.findById(req.params.userId);
    if (user) {
      const userEvent = user.eventsAttended.find(
        e => e.event.toString() === req.params.id
      );
      if (userEvent) {
        userEvent.attended = attended;
        await user.save();
      }
    }

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAttendanceReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};

    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) query.startDate.$gte = new Date(startDate);
      if (endDate) query.startDate.$lte = new Date(endDate);
    }

    const events = await Event.find(query)
      .select('title startDate registrations')
      .sort({ startDate: -1 });

    const report = events.map(event => ({
      eventId: event._id,
      title: event.title,
      date: event.startDate,
      totalRegistrations: event.registrations.length,
      totalAttended: event.registrations.filter(r => r.attended).length,
      attendanceRate: event.registrations.length > 0
        ? ((event.registrations.filter(r => r.attended).length / event.registrations.length) * 100).toFixed(1)
        : 0
    }));

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Session Attendance Management
exports.getSessionAttendees = async (req, res) => {
  try {
    const session = await PeerEducationSession.findById(req.params.id)
      .populate({
        path: 'participants.user',
        select: 'username email firstName lastName department year profileImage'
      })
      .populate('educators');

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        session: {
          id: session._id,
          title: session.title,
          date: session.date,
          educators: session.educators
        },
        attendees: session.participants
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markSessionAttendance = async (req, res) => {
  try {
    const { attended } = req.body;
    const session = await PeerEducationSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const participant = session.participants.find(
      p => p.user.toString() === req.params.userId
    );

    if (!participant) {
      return res.status(404).json({ success: false, message: 'Participant not found' });
    }

    participant.attended = attended;
    await session.save();

    // Update user's sessionsAttended
    const user = await User.findById(req.params.userId);
    if (user) {
      const userSession = user.sessionsAttended.find(
        s => s.session.toString() === req.params.id
      );
      if (userSession) {
        userSession.attended = attended;
        await user.save();
      }
    }

    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// System Settings
exports.getSystemSettings = async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();

    if (!settings) {
      settings = await SystemSettings.create({});
    }

    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSystemSettings = async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();

    if (!settings) {
      settings = await SystemSettings.create({
        ...req.body,
        lastUpdatedBy: req.user._id
      });
    } else {
      settings = await SystemSettings.findOneAndUpdate(
        {},
        { ...req.body, lastUpdatedBy: req.user._id },
        { new: true, runValidators: true }
      );
    }

    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Dashboard Statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalEvents,
      upcomingEvents,
      totalSessions,
      totalStories,
      pendingStories,
      totalResources
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Event.countDocuments(),
      Event.countDocuments({ startDate: { $gte: new Date() }, status: 'published' }),
      PeerEducationSession.countDocuments(),
      Story.countDocuments(),
      Story.countDocuments({ status: 'pending_review' }),
      Resource.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: { total: totalUsers, active: activeUsers },
        events: { total: totalEvents, upcoming: upcomingEvents },
        sessions: { total: totalSessions },
        stories: { total: totalStories, pending: pendingStories },
        resources: { total: totalResources }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const [recentUsers, recentEvents, recentStories] = await Promise.all([
      User.find().select('username email createdAt').sort({ createdAt: -1 }).limit(limit),
      Event.find().select('title startDate createdAt').sort({ createdAt: -1 }).limit(limit),
      Story.find().select('title status createdAt').sort({ createdAt: -1 }).limit(limit)
    ]);

    res.status(200).json({
      success: true,
      data: {
        recentUsers,
        recentEvents,
        recentStories
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Content Management
exports.getPendingContent = async (req, res) => {
  try {
    const [pendingStories, pendingResources, pendingGalleries] = await Promise.all([
      Story.find({ status: 'pending_review' })
        .populate('author', 'username email firstName lastName')
        .sort({ createdAt: -1 }),
      Resource.find({ status: 'pending_review' })
        .populate('uploadedBy', 'username email firstName lastName')
        .sort({ createdAt: -1 }),
      Gallery.find({ status: 'draft' })
        .populate('uploadedBy', 'username email firstName lastName')
        .sort({ createdAt: -1 })
    ]);

    res.status(200).json({
      success: true,
      data: {
        stories: pendingStories,
        resources: pendingResources,
        galleries: pendingGalleries
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveContent = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { notes } = req.body;
    let content;

    switch (type) {
      case 'story':
        content = await Story.findByIdAndUpdate(
          id,
          {
            status: 'approved',
            reviewedBy: req.user._id,
            reviewDate: new Date(),
            reviewNotes: notes
          },
          { new: true }
        );
        break;
      case 'resource':
        content = await Resource.findByIdAndUpdate(
          id,
          { status: 'approved' },
          { new: true }
        );
        break;
      case 'gallery':
        content = await Gallery.findByIdAndUpdate(
          id,
          { status: 'published' },
          { new: true }
        );
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid content type' });
    }

    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    res.status(200).json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.rejectContent = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { notes } = req.body || {};
    let content;

    switch (type) {
      case 'story':
        content = await Story.findByIdAndUpdate(
          id,
          {
            status: 'rejected',
            reviewedBy: req.user._id,
            reviewDate: new Date(),
            reviewNotes: notes
          },
          { new: true }
        );
        break;
      case 'resource':
        content = await Resource.findByIdAndUpdate(
          id,
          { status: 'archived' },
          { new: true }
        );
        break;
      case 'gallery':
        content = await Gallery.findByIdAndUpdate(
          id,
          { status: 'archived' },
          { new: true }
        );
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid content type' });
    }

    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    res.status(200).json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reports
exports.getUsersReport = async (req, res) => {
  try {
    const users = await User.find()
      .select('username email firstName lastName roles department year membershipStatus createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEventsReport = async (req, res) => {
  try {
    const events = await Event.find()
      .select('title eventType startDate endDate registrations status')
      .sort({ startDate: -1 });

    const report = events.map(event => ({
      ...event.toObject(),
      totalRegistrations: event.registrations.length,
      totalAttended: event.registrations.filter(r => r.attended).length
    }));

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSessionsReport = async (req, res) => {
  try {
    const sessions = await PeerEducationSession.find()
      .select('title topic date participants status')
      .populate('educators')
      .sort({ date: -1 });

    const report = sessions.map(session => ({
      ...session.toObject(),
      totalParticipants: session.participants.length,
      totalAttended: session.participants.filter(p => p.attended).length
    }));

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
