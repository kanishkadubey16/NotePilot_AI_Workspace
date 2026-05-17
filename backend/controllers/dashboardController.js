const Note = require('../models/Note');
const User = require('../models/User');

// @desc    Get dashboard analytics and productivity stats
// @route   GET /dashboard/stats
// @access  Private
const getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Basic counts
    const totalNotes = await Note.countDocuments({ userId, isArchived: false });
    const archivedNotes = await Note.countDocuments({ userId, isArchived: true });
    
    // 2. User specific AI stats
    const user = await User.findById(userId).select('aiRequestCount');
    const aiUsageCount = user ? user.aiRequestCount : 0;

    // 3. Recently edited (limit 5)
    const recentlyEdited = await Note.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('title updatedAt tags category');

    // 4. Aggregation: Most used tags (Top 5)
    const mostUsedTagsAgg = await Note.aggregate([
      { $match: { userId, tags: { $exists: true, $not: { $size: 0 } } } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const mostUsedTags = mostUsedTagsAgg.map(t => ({ name: t._id, count: t.count }));

    // 5. Aggregation: Weekly Activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyActivityAgg = await Note.aggregate([
      { 
        $match: { 
          userId, 
          updatedAt: { $gte: sevenDaysAgo } 
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Fill in zeros for days with no activity
    const weeklyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayData = weeklyActivityAgg.find(a => a._id === dateStr);
      weeklyActivity.push({
        date: dateStr,
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        count: dayData ? dayData.count : 0
      });
    }

    // 6. Shared notes count
    const sharedNotes = await Note.countDocuments({ userId, isPublic: true });

    // 7. AI usage breakdown by action
    const user2 = await User.findById(userId).select('aiUsageBreakdown');
    const aiUsageBreakdown = {
      summary: user2?.aiUsageBreakdown?.summary || 0,
      'action-items': user2?.aiUsageBreakdown?.['action-items'] || 0,
      title: user2?.aiUsageBreakdown?.title || 0,
      tags: user2?.aiUsageBreakdown?.tags || 0,
      improve: user2?.aiUsageBreakdown?.improve || 0
    };

    res.status(200).json({
      success: true,
      stats: {
        totalNotes,
        archivedNotes,
        sharedNotes,
        aiUsageCount,
        aiUsageBreakdown,
        recentlyEdited,
        mostUsedTags,
        weeklyActivity
      }
    });
  } catch (error) {
    next(new Error('Failed to fetch dashboard stats'));
  }
};

module.exports = { getStats };
