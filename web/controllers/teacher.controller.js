const teacherService = require("../../shared/services/teacher.service");
const lessonService = require("../../shared/services/lesson.service");
const classService = require("../../shared/services/class.service");
const matemaratonService = require("../../shared/services/matemaraton.service");
const arrayHelper = require("../../shared/helpers/array.helper");

// https://stackoverflow.com/a/46431916
const groupBy = (items, key) =>
    items.reduce(
        (result, item) => ({
            ...result,
            [item[key]]: [...(result[item[key]] || []), item]
        }),
        {}
    );

exports.getAll = async (req, res) => {
    const teachers = await teacherService.getAll();
    const teachersByArea = groupBy(teachers, "area");

    const data = {
        teachersByArea: teachersByArea,
        ctx: req.ctx
    };

    res.render("teacher/teachers", data);
};

exports.getTeacher = async (req, res) => {
    const teacherId = req.params.teacherId;
    const edition = await matemaratonService.getCurrentEdition();

    const [teacher, lessons] = await Promise.all([
        await teacherService.getOneById(teacherId),
        await lessonService.getLessonsForTeacher(teacherId, edition.period)
    ]);

    teacher.firstNameFirstChar = teacher.firstName.charAt(0);

    const uniqueClassesAsObject = lessons.reduce((acc, crt) => {
        if (crt.class) {
            acc[crt.class.id] = crt.class;
        }
        return acc;
    }, {});

    const uniqueClasses = arrayHelper.objectToArray(uniqueClassesAsObject);

    const data = {
        uniqueClasses,
        teacher,
        // lessons,
        ctx: req.ctx
    };

    if (teacher.area === "Invatamant primar") {
        const teacherClass = await classService.getPrimaryClassForTeacher(teacher._id);
        if (teacherClass) {
            data.teacherClass = {
                id: teacherClass._id,
                name: teacherClass.name
            };
        }
    }

    //res.send(data);
    res.render("teacher/teacher", data);
};
