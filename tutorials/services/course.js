const Course = require('../models/Course');

async function createCourse(courseData) {
    const course = new Course(courseData);
    await course.save();

    return course;
}

async function getAllCourses() {
    const courses = await Course.find({}).sort({ createdAt: -1 }).lean();

    return courses;
}

async function getCourseById(id) {
    const course = await Course.findById(id).lean();

    return course;
}

async function editCourse(courseId, courseData) {
    const course = await Course.findById(courseId);

    course.title = courseData.title;
    course.description = courseData.description;
    course.imageUrl = courseData.imageUrl;
    course.duration = courseData.duration;

    return course.save();

}

async function enrollCourse(userId, courseId) {

    const course = await Course.findById(courseId);

    course.usersEnrolled.push(userId);

    await course.save();

}


async function deleteCourse(courseId) {

    return Course.findByIdAndDelete(courseId);
}


module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    editCourse,
    enrollCourse,
    deleteCourse
};