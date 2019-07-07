import { renderComponent } from "/views/catalog/absence-list/absence-list.template.js";
import { getEventHandlers } from "/views/catalog/absence-list/absence-list.event-handlers.js";

export const renderAbsenceList = store => {
    const handlers = getEventHandlers(store);
    const state = store.getState();

    // combine input and output props
    const props = { ...mapStateToProps(state), ...mapDispatchToProps(handlers) };

    const container = getOutputContainer(props.subjectId);
    renderComponent(props, container);
};

//
//  ************ helpers ************
//
const getOutputContainer = subjectId => {
    const subjectContainer = document.getElementById(subjectId);
    return subjectContainer.querySelector(".absence-list-container");
};

// set INPUT data for the component (from state)
const mapStateToProps = state => ({
    subjectId: state.ui.selectedSubjectId,
    absences: state.absences
});

// set OUTPUT data for the component (event handlers)
const mapDispatchToProps = handlers => ({
    deleteAbsenceClickHandler: handlers.deleteAbsenceClickHandler,
    excuseAbsenceClickHandler: handlers.excuseAbsenceClickHandler
});
