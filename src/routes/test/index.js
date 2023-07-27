const express = require('express');
const dbModels = require('../../utilities/dbModels');
const router = express.Router();

router.get('/', async (req, res, next) => {
  // Tạo thành viên mới trong cơ sở dữ liệu
  const newMember = await dbModels.membersModel.create({
    fullName: 'Nguyen Tien Dat',
    birthday: '2002-04-18',
    image: 'abc',
    hometown: 'Hanoi',
    major: 'CNTT',
    job: 'Fullstack',
    course: 'D20',
    team: 5,
    achievements: 'Dep trai',
    quote: 'Vo ban la vo toi?',
  });

  // Trả về phản hồi thành công nếu tạo thành viên thành công
  return res.status(201).json({
    success: true,
    message: 'Member created successfully',
    member: newMember,
  });
});

router.get('/list-member', async (req, res, next) => {
  /**
   * @Note initial transaction
   * const transaction = await db.sequelize.transaction()
   */
  try {
    const data = await dbModels.bandsModel.findAll({});
    return res.status(200).json({
      success: true,
      message: 'Member list retrieved successfully',
      members: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve member list',
      error: error.message,
    });
  }
});

module.exports = router;
