class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.isActive = false;
  }
}

class UserManager {
  constructor() {
    this.users = [];
    this.activeUser = null;
    this.loadFromCookies();
    this.updateUI();
  }

  addUser(username, password) {
    const newUser = new User(username, password);
    this.users.push(newUser);
    this.setActiveUser(newUser);
  }

  updateUI() {
    const loginForm = document.getElementById("loginForm");
    const userList = document.getElementById("userList");

    if (this.activeUser) {
      this.hideElement(loginForm);
      this.clearElement(userList);

      const userProfile = this.createUserProfile(this.activeUser);
      userList.appendChild(userProfile);
    } else {
      this.showElement(loginForm);
      this.clearElement(userList);

      this.users.forEach((user) => {
        if (!user.isActive) {
          const userItem = this.createUserItem(user);
          userList.appendChild(userItem);
        }
      });
    }
  }

  setActiveUser(user) {
    if (this.activeUser) {
      this.activeUser.isActive = false;
    }
    user.isActive = true;
    this.activeUser = user;
    this.updateUI();
    this.saveToCookies();
  }

  removeAccount() {
    if (this.activeUser) {
      this.users = this.users.filter((user) => user !== this.activeUser);
      this.activeUser = null;
      this.updateUI();
      this.saveToCookies();
    }
  }

  logout() {
    if (this.activeUser) {
      this.activeUser.isActive = false;
      this.activeUser = null;
      this.updateUI();
      this.saveToCookies();
    }
  }

  saveToCookies() {
    document.cookie = `users=${JSON.stringify(this.users)}; path=/`;
  }

  loadFromCookies() {
    const usersCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("users="));

    if (usersCookie) {
      const usersString = decodeURIComponent(usersCookie.split("=")[1]);
      this.users = JSON.parse(usersString).map(
        (user) => new User(user.username, user.password)
      );
    }
  }

  createElement(tagName, textContent, className) {
    const element = document.createElement(tagName);
    element.textContent = textContent;
    element.classList.add(className);
    return element;
  }

  createButton(text, className) {
    const button = this.createElement("button", text, className);
    button.classList.add(className);
    return button;
  }

  createIcon(iconStyle, icon, className) {
    const i = this.createElement("i", "", className);
    i.classList.add(iconStyle);
    i.classList.add(icon);
    i.classList.add(className);
    return i;
  }

  createUserProfile(user) {
    const profile = this.createElement("li", user.username, "profile");
    profile.appendChild(
      this.createIcon("fa-regular", "fa-user", "profileIcon")
    );
    const profileBtnContainer = profile.appendChild(
      this.createElement("div", "", "profileBtnContainer")
    );
    profileBtnContainer
      .appendChild(this.createButton("Log Out", "logOutBtn"))
      .addEventListener("click", () => this.logout());
    profileBtnContainer
      .appendChild(this.createButton("Remove", "removeBtn"))
      .addEventListener("click", () => this.removeAccount());
    return profile;
  }

  createUserItem(user) {
    const userItem = this.createElement("li", user.username, "userItem");
    userItem.appendChild(
      this.createIcon("fa-regular", "fa-user", "userItemIcon")
    );
    userItem
      .appendChild(this.createButton("Log In", "logInBtn"))
      .addEventListener("click", () => this.setActiveUser(user));
    return userItem;
  }

  showElement(element) {
    element.style.display = "block";
  }

  hideElement(element) {
    element.style.display = "none";
  }

  clearElement(element) {
    element.innerHTML = "";
  }
}

const userManager = new UserManager();

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const inputUsername = usernameInput.value;
  const inputPassword = passwordInput.value;

  userManager.addUser(inputUsername, inputPassword);

  usernameInput.value = "";
  passwordInput.value = "";
});
