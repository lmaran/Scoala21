const mongoHelper = require("../../shared/helpers/mongo.helper");
const { ObjectID } = require("mongodb");

const collection = "mm-students";

exports.getOneById = async id => {
    const db = await mongoHelper.getDb();
    const teacher = await db.collection(collection).findOne({ _id: new ObjectID(id) });
    return teacher;
};

exports.getStudentsPerGrade = async (period, grade) => {
    const db = await mongoHelper.getDb();
    return await db
        .collection(collection)
        .aggregate([
            { $match: { "grades.period": period, "grades.grade": grade } },
            { $unwind: "$grades" },
            { $project: { shortName: 1, grade: "$grades.grade", class: "$grades.class" } }
        ])
        .toArray();
};

// exports.insertOne = async teacher => {
//     const db = await mongoHelper.getDb();
//     return await db.collection(collection).insertOne(teacher);
// };

// exports.updateOne = async teacher => {
//     const db = await mongoHelper.getDb();
//     teacher._id = mongoHelper.normalizedId(teacher._id);
//     return await db.collection(collection).updateOne({ _id: teacher._id }, teacher);
// };

// exports.deleteOneById = async id => {
//     const db = await mongoHelper.getDb();
//     id = mongoHelper.normalizedId(id);
//     return await db.collection(collection).deleteOne({ _id: id });
// };
