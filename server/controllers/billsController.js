// const { PrismaClient } = require('@prisma/client');

// const prisma = new PrismaClient();

// const createBill = async (req, res) => {
//   const { id, name, description, image } = req.body;
//   try {
//     const newBill = await prisma.bill.create({
//       data: {
//         name: name,
//         description: description,
//         image: image,
//         user: {
//           connect: { id: parseInt(id) },
//         },
//       },
//     });
//     res.status(201).json(newBill);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };



// const getBillByUser = async (req, res) => {
//     const { userId } = req.params;
//     try {
//       const bills = await prisma.bill.findMany({
//         where: { userId: Number(userId) },
//       });
//       res.status(200).json(bills);
//     } catch (error) {
//       res.status(500).json({ message: 'Server error' });
//     }
//   };


//   const updateBill = async (req, res) => {
//     const { billId } = req.params;
//     const { name, description } = req.body;
//     const image = req.file ? req.file.path : null;
  
//     try {
//       const updatedBill = await prisma.bill.update({
//         where: { id: Number(billId) },
//         data: {
//           name: name,
//           description: description,
//           image: image,
//         },
//       });
//       res.status(200).json(updatedBill);
//     } catch (error) {
//       res.status(500).json({ message: 'Server error' });
//     }
//   };


//   const deleteBill = async (req, res) => {
//     const { billId } = req.params;
//     console.log(billId)
//     try {
//       const bills = await prisma.bill.delete({
//         where: { id: Number(billId) },
//       });
  
//       res.status(200).json(bills);
//     } catch (error) {
//       res.status(500).json({ message: 'Server error' });
//     }
//   };

// module.exports = { createBill, getBillByUser, deleteBill, updateBill };

const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');

const prisma = new PrismaClient();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const createBill = async (req, res) => {
  const { id, name, description } = req.body;
  const image = req.file ? req.file.buffer : null;

  try {
    const newBill = await prisma.bill.create({
      data: {
        name: name,
        description: description,
        image: image,
        user: {
          connect: { id: parseInt(id) },
        },
      },
    });
    res.status(201).json(newBill);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBillByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const bills = await prisma.bill.findMany({
      where: { userId: Number(userId) },
    });
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateBill = async (req, res) => {
  const { billId } = req.params;
  const { name, description } = req.body;
  const image = req.file ? req.file.buffer : null; // Get image as Buffer

  try {
    const updatedBill = await prisma.bill.update({
      where: { id: Number(billId) },
      data: {
        name: name,
        description: description,
        image: image,
      },
    });
    res.status(200).json(updatedBill);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteBill = async (req, res) => {
  const { billId } = req.params;
  try {
    const deletedBill = await prisma.bill.delete({
      where: { id: Number(billId) },
    });
    res.status(200).json(deletedBill);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createBill, getBillByUser, deleteBill, updateBill, upload};
