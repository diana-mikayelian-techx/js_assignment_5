// 1. DOM ELEMENT REFERENCES

const btnWithHeader = document.getElementById("btn-with-header");
const btnWithoutHeader = document.getElementById("btn-without-header");
const statusEl = document.getElementById("status");      
const usersListEl = document.getElementById("users-list"); 


// 2. SMALL HELPER: delay(ms)

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


// 3. RENDERING HELPERS

function showLoading() {
  statusEl.textContent = "Loading...";
  usersListEl.textContent = "";
}

function clearLoading() {
  statusEl.textContent = "";
}

function showNoUsers() {
  usersListEl.textContent = "";

  const li = document.createElement("li");
  li.textContent = "No users";
  usersListEl.appendChild(li);
}

function showUsers(fullNames) {
  usersListEl.textContent = "";

  fullNames.forEach((name) => {
    const li = document.createElement("li");
    li.textContent = name; 
    usersListEl.appendChild(li);
  });
}


// 4. MAIN ASYNC FUNCTION

async function fetchUsers(includeHeader) {
  showLoading();

  console.log("Fetching users...");

  const url = "https://reqres.in/api/users-?delay=1";

  const options = {
    method: "GET",
    headers: {}
  };


  if (includeHeader) {
    options.headers["x-api-key"] = "reqres-free-v1";
  }

  try {
    // 4.1. SEND REQUEST

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error("HTTP error: " + response.status);
    }

    const data = await response.json();

    const users = Array.isArray(data.data) ? data.data : [];

    if (!users || users.length === 0) {
      showNoUsers();
      return; 
    }

    // 4.2. EXTRA 1 SECOND DELAY
    
    await delay(1000); 

    // 4.3. LOG DATA + MAP NAMES

    console.log("Response data:", data);

    const fullNames = users.map((user) => {
      return user.first_name + " " + user.last_name;
    });

    console.log("Full names:", fullNames);

    showUsers(fullNames);

    console.log("Done.");

  } catch (error) {
    // 4.4. ERROR / FAILURE CASE
    console.error("Fetch failed:", error);
    showNoUsers();

  } finally {
    // 4.5. ALWAYS CLEAR LOADING
    clearLoading();
  }
}


// 5. WIRE BUTTONS TO FUNCTION
btnWithHeader.addEventListener("click", () => {
  fetchUsers(true);
});

btnWithoutHeader.addEventListener("click", () => {
  fetchUsers(false);
});
