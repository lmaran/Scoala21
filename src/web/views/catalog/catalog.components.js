import { html, render } from "/scripts/lit-html/lit-html.js";

const ALL_MONTHS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
const ALL_DAYS = [...Array(31)].map((crt, i) => i + 1); // [1, 2, 3 ... 31]

const templateAbsenceList = (data, methods) =>
    html`
        <ul>
            ${data.absences.map(
                absence =>
                    html`
                        <li id=${absence.id}>
                            <span class="absence-value-span ${absence.isExcused ? "text-success" : ""}"
                                >${absence.friendlyDate}</span
                            >
                            ${!absence.isExcused
                                ? html`
                                      <button class="btn btn-link" @click=${methods.excuseAbsence}>
                                          Motiveza
                                      </button>
                                      |
                                  `
                                : html``}
                            <button class="btn btn-link" @click=${methods.deleteAbsence}>
                                Sterge
                            </button>
                            <span
                                class="spinner ${absence.deleteAbsenceIsInProgress || absence.excuseAbsenceIsInProgress
                                    ? ""
                                    : "d-none"}"
                            >
                                <i class="fas fa-spinner spinning"></i>
                            </span>
                        </li>
                    `
            )}
        </ul>
    `;

const templateAbsenceAddForm = (data, methods) =>
    html`
        <div class="absence-add-form ml-4 mt-1">
            <div>Luna:</div>
            <div class="month-container btn-group btn-group-toggle flex-wrap mb-3" data-toggle="buttons">
                ${ALL_MONTHS.map(
                    crt =>
                        html`
                            <label class="btn btn-light">
                                <input type="radio" name="options" id="option1" autocomplete="off" /> ${crt}
                            </label>
                            ${crt === "VII"
                                ? html`
                                      <label class="btn btn-light flex-new-line"></label>
                                  `
                                : html``}
                        `
                )}
            </div>

            <div>Ziua:</div>
            <div class="day-container btn-group btn-group-toggle flex-wrap mb-3" data-toggle="buttons">
                ${ALL_DAYS.map(
                    crt =>
                        html`
                            <label class="btn btn-light">
                                <input type="checkbox" name="options" id="option1" autocomplete="off" />
                                ${crt}
                            </label>
                            ${crt === 7 || crt === 14 || crt === 21 || crt === 28
                                ? html`
                                      <label class="btn btn-light flex-new-line"></label>
                                  `
                                : html``}
                        `
                )}
            </div>

            <div class="form-check mb-3 mr-sm-2">
                <input class="form-check-input is-excused-input" type="checkbox" id="inlineFormCheck" />
                <label class="form-check-label" for="inlineFormCheck">
                    Absentele selectate sunt motivate
                </label>
            </div>

            <div class="pb-3">
                <button class="save-absences-btn btn btn-sm btn-success" @click=${methods.saveAbsences}>
                    Salveaza si cont.
                </button>
                <button class="collapse-add-absence-btn btn btn-sm btn-link" @click=${methods.collapseAddAbsence}>
                    Renunta
                </button>
                <span class="spinner spinner-md ${data.addAbsenceIsInProgress ? "" : "d-none"}">
                    <i class="fas fa-spinner spinning"></i>
                </span>
            </div>
        </div>
    `;

const templateAbsence = (data, methods) =>
    html`
        <div class="font-weight-bold">Absente:</div>

        ${data.absences ? templateAbsenceList(data, methods) : html``}

        <button class="expand-add-absence-btn btn btn-sm btn-primary ml-4 mt-1" @click=${methods.expandAddAbsence}>
            Adauga absente
        </button>

        ${data.addAbsenceIsExpanded ? templateAbsenceAddForm(data, methods) : html``}
    `;

let methods;

export const components = {
    init: eventHandlers => (methods = eventHandlers),
    renderAbsence: (data, domElement) => render(templateAbsence(data, methods), domElement)
};
