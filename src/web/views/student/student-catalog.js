import { PI, renderAbsenceList2, renderAbsenceCreate } from "/views/student/my-module.js";
import eventEmitter from "/views/student/event-emitter.js";

import { renderAbsenceList } from "/views/student/absence-list.component.js";

const uiDataTemplate = document.getElementById("ui-data");
const uiData = JSON.parse(uiDataTemplate.innerHTML);

const addMarkBtns = document.getElementsByClassName("add-mark-btn");

for (const addMarkBtn of addMarkBtns) {
    addMarkBtn.addEventListener("click", function(event) {
        const closestSubjectParent = addMarkBtn.closest(".subject-container"); // find the closest ancestor which matches the selectors
        // const dataset = closestParent.dataset;
        // console.log(closestSubjectParent.dataset.subjectId);
        // console.log(closestSubjectParent.dataset.subjectName);

        const subject = {
            id: closestSubjectParent.dataset.subjectId,
            name: closestSubjectParent.dataset.subjectName
        };

        // console.log(uiData);

        const closestMarkParent = addMarkBtn.closest(".marks-container"); // find the closest ancestor which matches the selectors
        // console.log(closestMarkParent.dataset.test);

        const closestMarkListChild = closestMarkParent.querySelector(".marks-list-container");
        // console.log(closestMarkListChild.dataset.test);

        // li.appendChild(document.createTextNode(name));
        // const markValue = 23;

        const markValueEl = closestMarkParent.querySelector(".mark-value");
        const markValueTmp = markValueEl.value;
        if (!markValueTmp) {
            alert("Lipseste nota!");
            return false;
        }
        const markValue = Number(markValueEl.value);
        if (!markValue) {
            alert("Nota trebuie sa fie un numar!");
            return false;
        }

        // const o = { aa: 1, bb: 1.1, cc: "1.2", dd: markValue };

        // console.log(markValue);
        // console.log(JSON.stringify(o));
        // return false;
        // onst markValue = markValueEl.value;

        const markDateEl = closestMarkParent.querySelector(".mark-date");
        const markDate = markDateEl.value;
        // const markId = closestMarkParent.queryElementById();

        // const newMarkTemplate = document.getElementById("new-mark");
        // li.innerHTML = newMarkTemplate.innerHTML;

        // ---------send data
        const url = "/catalog";
        const data = {
            academicYear: uiData.academicYear,
            semester: uiData.semester,
            class: uiData.class,
            student: uiData.student,
            subject,
            itemType: "mark",
            itemValue: markValue,
            itemDate: markDate
        };

        fetch(url, {
            method: "POST", // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            // .then(response => console.log("Success:", JSON.stringify(response)))
            .then(response => {
                // update DOM
                const newLi = document.createElement("li");
                newLi.setAttribute("id", response._id);

                newLi.innerHTML = `
                        <span>${response.itemValue}</span>
                        <span class='text-muted'>/ ${response.itemDate}</span>
                        <button type='button' class='btn btn-link'>Sterge</button>
                    `;

                newLi.addEventListener("click", deleteGradebookItem);

                closestMarkListChild.appendChild(newLi);

                // clear input elements
                markValueEl.value = "";
                markDateEl.value = "";
            })
            .catch(error => console.error("Error:", error));

        // console.log(closestMarkListChild.dataset.test);

        // alert(JSON.stringify(data));
    });
}

const showAbsenceBtns = document.getElementsByClassName("show-absence-btn");
for (const showAbsenceBtn of showAbsenceBtns) {
    showAbsenceBtn.addEventListener("click", function(event) {
        const subjectContainer = showAbsenceBtn.closest(".subject-container"); // find the closest ancestor which matches the selectors

        // const subject = {
        //     id: subjectContainer.dataset.subjectId,
        //     name: subjectContainer.dataset.subjectName
        // };
        // console.log(subject.name);

        const absenceListContainer = subjectContainer.querySelector(".absence-list-container");

        // var data = "blabla";
        var data = {
            absences: [
                {
                    itemId: "111",
                    itemDate: "aaa2",
                    itemIsExcused: true
                },
                {
                    itemId: "222",
                    itemDate: "bbb2",
                    itemIsExcused: false
                }
            ]
        };
        // absenceListContainer.innerHTML = "";
        // renderAbsenceList(data, absenceListContainer.id);

        const absenceCreateContainer = subjectContainer.querySelector(".absence-create-container"); // find the closest ancestor which matches the selectors
        // console.log(closestAbsenceParent.dataset.test);

        // showAbsenceBtn.style.display = "none";
        if (absenceCreateContainer.style.display === "none") {
            // showAbsenceBtn.innerHTML = "Adauga absenta";
        } else {
            // showAbsenceBtn.innerHTML = "Renunta";
            // showAbsenceBtn.classList.add("disabled");
        }
        showAbsenceBtn.classList.add("disabled");
        absenceCreateContainer.style.display = "block";
        renderAbsenceCreate(data, absenceCreateContainer, absenceListContainer);
    });
}

const hideAbsenceBtns = document.getElementsByClassName("hide-absence-btn");
for (const hideAbsenceBtn of hideAbsenceBtns) {
    hideAbsenceBtn.addEventListener("click", function(event) {
        // showAbsenceBtn.style.display = "none";
        const closestSubjectParent = hideAbsenceBtn.closest(".subject-container"); // find the closest ancestor which matches the selectors

        // const subject = {
        //     id: closestSubjectParent.dataset.subjectId,
        //     name: closestSubjectParent.dataset.subjectName
        // };
        // console.log(subject.name);

        const closestShowAbsenceBtn = closestSubjectParent.querySelector(".show-absence-btn");
        // closestShowAbsenceBtn.style.display = "block";
        closestShowAbsenceBtn.classList.remove("disabled");

        const closestAbsenceParent = closestSubjectParent.querySelector(".absence-create-container"); // find the closest ancestor which matches the selectors
        // console.log(closestAbsenceParent.dataset.test);
        closestAbsenceParent.style.display = "none";
    });
}

const saveAbsencesBtns = document.getElementsByClassName("save-absences-btn");
for (const saveAbsencesBtn of saveAbsencesBtns) {
    saveAbsencesBtn.addEventListener("click", function(event) {
        const closestSubjectParent = saveAbsencesBtn.closest(".subject-container"); // find the closest ancestor which matches the selectors

        // const subject = {
        //     id: closestSubjectParent.dataset.subjectId,
        //     name: closestSubjectParent.dataset.subjectName
        // };
        // console.log(subject.name);

        const isExcusedInput = closestSubjectParent.querySelector(".is-excused-input");
        const isExcused = isExcusedInput.checked;

        const monthLabel = closestSubjectParent.querySelector(".month-container label.active");
        const month = monthLabel.innerText;

        const dayLabels = closestSubjectParent.querySelectorAll(".day-container label.active");

        for (const dayLabel of dayLabels) {
            console.log(dayLabel.innerText);
        }

        const resultDiv = closestSubjectParent.querySelector(".result"); // find the closest ancestor which matches the selectors
        // resultDiv.innerHTML = isExcusedInput.checked;
        resultDiv.innerHTML = monthLabel.innerText;

        // // console.log(closestAbsenceParent.dataset.test);

        // // showAbsenceBtn.style.display = "none";
        // if (closestAbsenceParent.style.display === "none") {
        //     // showAbsenceBtn.innerHTML = "Adauga absenta";
        // } else {
        //     // showAbsenceBtn.innerHTML = "Renunta";
        //     // showAbsenceBtn.classList.add("disabled");
        // }
        // showAbsenceBtn.classList.add("disabled");
        // closestAbsenceParent.style.display = "block";
    });
}

// const deleteButtons = document.querySelectorAll("button.delete-btn");
const deleteButtons = document.getElementsByClassName("delete-btn");
const excuseButtons = document.getElementsByClassName("excuse-btn");

const deleteGradebookItem = function(event) {
    // alert(123);

    let deleteAbsenceBtn = event.target;

    const closestSubjectParent = deleteAbsenceBtn.closest(".subject-container"); // find the closest ancestor which matches the selectors

    // const subject = {
    //     id: closestSubjectParent.dataset.subjectId,
    //     name: closestSubjectParent.dataset.subjectName
    // };
    // console.log(subject.name);

    const absenceListContainer = closestSubjectParent.querySelector(".absence-list-container");

    var data = {
        absences: [
            {
                id: "111",
                itemDate: "aaa",
                itemIsExcused: true
            },
            {
                id: "222",
                itemDate: "bbb",
                itemIsExcused: false
            }
        ]
    };

    renderAbsenceList(data, absenceListContainer.id);

    return false;

    const deleteButton = event.target;
    const parentLi = deleteButton.closest("li");
    const itemId = parentLi.id;
    // alert(itemId);

    const url = `/catalog/${itemId}`;
    fetch(url, { method: "DELETE" })
        .then(() => {
            // update DOM

            parentLi.remove();
            // parentLi.parentNode.removeChild(parentLi); // https://stackoverflow.com/a/8830882 (for better compatibility)
        })
        .catch(error => console.error("Error:", error));
};

// output (same as in component)
const deleteAbsence = event => {
    const absenceId = event.target.closest("li").id;
    eventEmitter.dispatchEvent(new CustomEvent("DELETE_ABSENCE", { detail: absenceId })); // "detail" is a reserved word
};

for (const deleteButton of deleteButtons) {
    deleteButton.addEventListener("click", deleteAbsence);
}

// output (same as in component)
const excuseAbsence = event => {
    const absenceId = event.target.closest("li").id;
    eventEmitter.dispatchEvent(new CustomEvent("EXCUSE_ABSENCE", { detail: absenceId })); // "detail" is a reserved word
};

for (const excuseButton of excuseButtons) {
    excuseButton.addEventListener("click", excuseAbsence);
}

// absence-list actions:
eventEmitter.addEventListener("DELETE_ABSENCE", event => {
    const absenceId = event.detail;
    const subjectId = getSubjectIdByAbsenceId(absenceId);

    let absences = getAbsencesBySubjectId(subjectId)
        .filter(x => x.itemId !== absenceId)
        .map(x => x); // immutable

    // update main data
    uiData.allSubjects.find(x => x.subject.id === subjectId).absences = absences;

    var data = { absences };

    renderAbsenceList(data, subjectId);
});

eventEmitter.addEventListener("EXCUSE_ABSENCE", event => {
    const absenceId = event.detail;
    const subjectId = getSubjectIdByAbsenceId(absenceId);

    let absences = getAbsencesBySubjectId(subjectId)
        // .filter(x => x.itemId !== absenceId)
        .map(x => {
            if (x.itemId === absenceId) {
                x.itemIsExcused = true;
            }
            return x;
        }); // immutable

    // update main data
    uiData.allSubjects.find(x => x.subject.id === subjectId).absences = absences;

    var data = { absences };

    renderAbsenceList(data, subjectId);
});

function getSubjectIdByAbsenceId(absenceId) {
    let subjectId = null;
    uiData.allSubjects.some(subject => {
        const found = subject.absences && subject.absences.find(x => x.itemId === absenceId);
        if (found) {
            subjectId = subject.subject.id;
            return true;
            // return subject.subject.id;
        }
    });
    return subjectId;
}

function getAbsencesBySubjectId(subjectId) {
    // console.log(uiData.allSubjects);
    const subject = uiData.allSubjects.find(x => x.subject.id === subjectId);
    return subject.absences;
}
