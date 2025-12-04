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

  const url = "https://reqres.in/api/users?delay=1";

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  if (includeHeader) {
    options.headers["x-api-key"] = "reqres_c865a05b708d483bbc80199db10ba2a8";
  }

  try {
    const response = await fetch(url, options);
    console.log("HTTP status:", response.status);

    if (!response.ok) {
      throw new Error("HTTP error: " + response.status);
    }

    const data = await response.json();
    console.log("Response data:", data);

    const users = Array.isArray(data.data) ? data.data : [];

    if (!users.length) {
      showNoUsers();
      return;
    }

    await delay(1000);

    const fullNames = users.map((u) => `${u.first_name} ${u.last_name}`);
    console.log("Full names:", fullNames);

    showUsers(fullNames);
    console.log("Done.");
  } catch (error) {
    console.error("Fetch failed:", error);
    showNoUsers();
  } finally {
    clearLoading();
  }
}

// 5. BUTTONS
btnWithHeader.addEventListener("click", () => fetchUsers(true));
btnWithoutHeader.addEventListener("click", () => fetchUsers(false));
