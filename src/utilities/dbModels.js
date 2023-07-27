const db = require('../core/database/models');
module.exports = {
  membersModel: db.members,
  memberBandsModel: db.members_bands,
  memberSkillModel: db.members_skills,
  newsModel: db.news,
  outstandingMembersModel: db.outstanding_members,
  periodsModel: db.periods,
  bandsModel: db.bands,
  skillsModel: db.skills,
  thumbnailsModel: db.thumbnails,
  userVerificationsModel: db.user_verifications,
  usersModel: db.users,
  newsCommentsModel: db.news_comments,
  newsSubjectsModel: db.news_subjects,
  subjectsModel: db.subjects,
};
