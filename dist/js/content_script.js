
$(document).ready(function () {


    var curr_url_path = window.location.href;
    curr_url_path = curr_url_path.replace("https://moodlearn.ariel.ac.il/", "");
    curr_url_path = curr_url_path.replace("http://moodlearn.ariel.ac.il/", "");

    console.log(curr_url_path);

    var signInLink = $('a').filter(function (index) { return $(this).text().includes('התחברות'); });


    switch (curr_url_path) {

        case "": {
            if (signInLink.length > 0) {
                signInLink[0].click();
            } else {
                removeMainFrameAndCourses();
            }
            break;
        }

        case "login/index.php": {
            handleLogin();
            break;
        }

        default:
            break;

    }

    function handleLogin() {
        chrome.storage.sync.get({
            autologin: false,
            username: "",
            password: ""
        }, function (items) {

            if (items.autologin) {
                $('#username').val(items.username);
                $('#password').val(items.password);
                $('#loginbtn').click();
            }

        });

    }


    function removeMainFrameAndCourses() {

        chrome.storage.sync.get({
            autologin: false,
            username: "",
            password: "",
            hideCourses: true,
            hideExtra: true
        }, function (items) {
            if (items.hideExtra) {
                //remove annoying header
                $('.container-fluid')[0].remove();
                $('#frontpage-ariel').remove();

                //remove accesibility
                $('#inst339474').remove();
                $('#inst28797').remove();
                $('#inst4').remove();
                $('#inst227770').remove();
                $('#block-region-side-post').remove();
                $('#block-region-side-pre').remove();

                // links to remove
                var links = ['דילוג על הקורסים שלי'];
                links.forEach(function (linkName) {
                    var allFitLinks = $('a').filter(function (index) { return $(this).text().includes(linkName); });
                    for (var i = 0; i < allFitLinks.length; i++) {
                        allFitLinks[i].remove();

                    }

                }, this);

            }

            if (items.hideCourses) {
                var courseNames = [];
                chrome.storage.sync.get('courselist', function (result) {
                    courseNames = result.courselist;
                    console.debug(courseNames);
                    // remove courses
                    if(!courseNames) return;

                    courseNames.forEach(function (coursesName) {
                        var allFitLinks = $('a').filter(function (index) { return $(this).text().includes(coursesName); });
                        for (var i = 0; i < allFitLinks.length; i++) {
                            var courseBox = allFitLinks[i].closest('.coursebox');
                            if (courseBox) {
                                courseBox.remove();
                            }
                        }

                    }, this);
                });
            }

        });





    }
});





