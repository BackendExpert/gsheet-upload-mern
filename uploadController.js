const XLSX = require('xlsx');
const fs = require('fs');
const UploadModel = require('./uploadmodel');
const path = require('path');

const UploadController = {
    uploadGSheet: async (req, res) => {
        try {
            const file = req.file;

            if (!file) {
                return res.status(400).json({ message: 'No file uploaded.' });
            }

            // Read Excel file
            const workbook = XLSX.readFile(file.path);
            const sheetName = workbook.SheetNames[0];
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            const inserted = [];
            const duplicates = [];

            for (const student of sheetData) {
                const exists = await UploadModel.findOne({ enrolmentNo: student['Enrolment_No.'] });

                if (exists) {
                    duplicates.push(student['Enrolment_No.']);
                    continue;
                }

                const newStudent = new UploadModel({
                    no: student['No'],
                    enrolmentNo: student['Enrolment_No.'],
                    indexNo: student['Index_No'],
                    name: student['Name'],
                    title: student['Title'],
                    lastName: student['L_Name'],
                    initials: student['Initials'],
                    fullName: student['Full_Name'],
                    alDistrict: student['alDistrict'],
                    sex: student['Sex'],
                    zScore: parseFloat(student['Z_Score']),
                    medium: student['Medium'],
                    nic: student['NIC'],
                    address1: student['ADD1'],
                    address2: student['ADD2'],
                    address3: student['ADD3'],
                    fullAddress: student['Address'],
                    email: student['email'],
                    phone1: student['Phone_No'],
                    phone2: student['Phone_No_2'] || '',
                    genEnglishMarks: student['Gen_English_Marks'] ? parseInt(student['Gen_English_Marks']) : null,
                    intake: student['Intake'],
                    dateOfEnrolment: student['Date_of_Enollment']
                });

                await newStudent.save();
                inserted.push(student['Enrolment_No.']);
            }

            // Delete uploaded file after use
            fs.unlinkSync(file.path);

            res.status(200).json({
                message: 'Upload complete.',
                insertedCount: inserted.length,
                duplicateCount: duplicates.length,
                duplicates
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error during upload.' });
        }
    }
};

module.exports = UploadController;
