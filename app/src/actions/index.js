import axios from "axios"


export default {

    toggleLoading: on => state => ({loading: on}),

    setTypeBoxValue: val => () => {
        console.log(val);
        return {typeBox: val}
    },

    init: () => (state, actions) => {
        console.log("init app state");
        actions.loadCourses();
    },

    setCourseList: (list) => () => ({courseList: list}),

    saveCourse: () => ({typeBox}, actions) => {
        // console.log("value typed:", typeBox);
        if (!typeBox) {
            console.error("No course was typed in!");
            return;
        }

        chrome.storage.sync.get('courselist', function (result) {
            const courses = result.courselist || [];
            if (courses.indexOf(typeBox) === -1) {
                courses.push(typeBox);
            }

            chrome.storage.sync.set({'courselist': courses}, function () {
                actions.loadCourses();
            });

        });

        return {typeBox:""}
    },

    deleteCourse: (idx) => ({courseList}, actions) => {
        // console.log("Deleting item idx:", idx, "value:", courseList[idx]);
        courseList.splice(idx,1);
        chrome.storage.sync.set({'courselist': courseList}, function () {
            actions.loadCourses();
        });
    },

    loadCourses: () => (state, actions) => {
        chrome.storage.sync.get('courselist', function (result) {
            const courses = result.courselist;
            console.debug(courses);
            actions.setCourseList(courses);
        });
    }
};
