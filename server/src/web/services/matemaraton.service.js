const mongoHelper = require("../../shared/helpers/mongo.helper");
const { ObjectID } = require("mongodb");

const collection = "mm-presence";
const coursesCollection = "mm-courses";

exports.getPresencePerGroup = async (period, grade, groupName) => {
    const db = await mongoHelper.getDb();
    return await db
        .collection(collection)
        .find({ period: period, grade: grade, groupName: groupName })
        .sort({ date: -1 })
        .toArray();
};

exports.getCoursesPerGroup = async (period, grade, groupName) => {
    const db = await mongoHelper.getDb();
    return await db
        .collection(coursesCollection)
        .find({ period: period, grade: grade, groupName: groupName })
        .sort({ date: -1 })
        .toArray();
};

exports.getPresencePerGrade = async (period, grade) => {
    const db = await mongoHelper.getDb();
    return await db
        .collection(collection)
        .find({ period: period, grade: grade })
        .sort({ date: -1 })
        .toArray();
};

exports.getPresencePerPeriod = async period => {
    const db = await mongoHelper.getDb();
    return await db
        .collection(collection)
        .find({ period: period })
        .sort({ date: -1 })
        .toArray();
};

exports.getStudentsPerGrade = async (period, grade) => {
    const db = await mongoHelper.getDb();
    return await db
        .collection("students")
        .aggregate([
            { $match: { "grades.period": period, "grades.grade": grade } },
            { $unwind: "$grades" },
            { $project: { shortName: 1, grade: "$grades.grade", class: "$grades.class" } }
        ])
        .toArray();
};

exports.getCurrentEdition = async () => {
    const db = await mongoHelper.getDb();
    return await db.collection("mm-editions").findOne({ isCurrent: true });
};

exports.getSelectedEdition = async edition => {
    const db = await mongoHelper.getDb();
    return await db.collection("mm-editions").findOne({ edition: edition });
};

exports.getCourse = async id => {
    const db = await mongoHelper.getDb();
    return await db.collection("mm-courses").findOne({ _id: new ObjectID(id) });
};
