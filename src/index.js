let employeeElem = document.querySelector(".employee__list--item");
let employeeInfoElem = document.querySelector(".employee__info");
let addEmployeeFormElem = document.querySelector(".addEmployee_create");
let addEmployeeModal = document.querySelector(".addEmployee");
// Set Employee age to be entered minimum 18 years
const dobInput = document.querySelector(".addEmployee_create--dob");
dobInput.max = `${
  new Date().getFullYear() - 18
}-${new Date().toISOString().slice(5, 10)}`;
(async () => {
  let empList = await fetch("/src/employeeData.json").then((res) => res.json());
  let selectedEmployeeId = empList[0].id;
  let selectedEmployee = empList[0];
  appendEmployeeData(empList);
  renderSingleEmployee();

  function renderSingleEmployee() {
    if (Object.keys(selectedEmployee).length !== 0) {
      employeeInfoElem.innerHTML = `
      <img src=${selectedEmployee.imageUrl} alt=${selectedEmployee.id} />
     <span class="employee__info--heading">Name :  ${selectedEmployee.firstName}  ${selectedEmployee.lastName}</span>
     <span> DOB : ${selectedEmployee.dob}</span>
     <span>Email : ${selectedEmployee.emailId}</span>
     <span> Mobile : ${selectedEmployee.phoneNumber}</span>`;
    } else {
      employeeInfoElem.innerHTML = "No Employee Details ";
    }
  }
  function appendEmployeeData() {
    employeeElem.innerHTML = "";
    empList.forEach((emp) => {
      const empNode = document.createElement("span");
      empNode.classList.add("employee__list--title");
      empNode.innerHTML = `${emp.firstName}  ${emp.lastName}  <i >❌</i>`;
      if (parseInt(selectedEmployeeId, 10) === emp.id) {
        empNode.classList.add("selected");
        selectedEmployee = emp;
      }
      empNode.setAttribute("id", emp.id);
      employeeElem.appendChild(empNode);
    });
  }
  employeeElem.addEventListener("click", (e) => {
    console.log(e.target.tagName);
    if (e.target.tagName == "SPAN" && selectedEmployeeId != e.target.id) {
      selectedEmployeeId = e.target.id;
    }

    if (e.target.tagName === "I") {
      empList = empList.filter((emp) => emp.id != e.target.parentNode.id);
    }

    if (Number(e.target.parentNode.id) === selectedEmployeeId) {
      selectedEmployeeId = empList[0]?.id || 0;
      selectedEmployee = empList[0] || {};
    }
    appendEmployeeData();
    renderSingleEmployee();
  });

  document.querySelector(".header__btn--add").addEventListener("click", () => {
    addEmployeeModal.style.display = "flex";
  });

  addEmployeeFormElem.addEventListener("submit", (e) => {
    e.preventDefault();
    let formData = new FormData(addEmployeeFormElem);
    const values = [...formData.entries()];
    let empData = {};
    values.forEach((data) => {
      empData[data[0]] = data[1];
    });
    empData.id = empList.length == 0 ? 1 : empList[empList.length - 1].id + 1;
    empData.age =
      new Date().getFullYear() - parseInt(empData.dob.slice(0, 4), 10);
    empData.imageUrl =
      empData.imageUrl || "https://cdn-icons-png.flaticon.com/512/0/93.png";

    empList.push(empData);

    appendEmployeeData();
    addEmployeeFormElem.reset();

    if (empList.length == 1) {
      selectedEmployeeId = empList[0].id;
      selectedEmployee = empList[0];
      renderSingleEmployee();
    }
    addEmployeeModal.style.display = "none";
  });
})();
