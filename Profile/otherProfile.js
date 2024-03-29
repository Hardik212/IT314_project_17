const getDetailsAboutPoll = (pollid) => {
  localStorage.setItem("poll_details", JSON.stringify(pollid));
  window.open(`../Poll Results/result.html?pollid=${pollid}`, "_blank");
};
window.onload = async (event) => {
  await getAllpolls();

  const name = document.getElementById("name");
  const username = document.getElementById("username");
  const profile = document.getElementById("profile-pic");
  const bio = document.getElementById("bio");
  const followers = document.getElementById("community-followers");
  const following = document.getElementById("community-following");
  const pollscreated = document.getElementById("pollscreated");

  let url = window.location.href;
  let urlArray = url.split("=");
  const otherUsername = urlArray[urlArray.length - 1];

  const token = JSON.parse(localStorage.getItem("token"));
  const response = await fetch(
    `https://quickpolls-2zqu.onrender.com/api/auth/otherprofile/${otherUsername}`,
    {
      method: "POST",
      headers: {
        Accept: "applicaiton/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
      }),
      withCredentials: true, // should be there
      credentials: "include", // should be there
    }
  );

  let data = await response.json();
  //   console.log("user", data.data);
  const user = data.data;

  showPage();

  if (user) {
    name.innerText = user.name;
    username.innerText = user.username;
    bio.innerText = user.bio;
    profile.src = user.profilepic;
    followers.innerText = user.followers.length;
    following.innerText = user.following.length;
    pollscreated.innerText = user.pollscreated.length;
    pollsanswered.innerText = user.pollsanswered;
    document.getElementsByClassName("avatar")[0].src = user.profilepic;
  } else {
    document.body.innerHTML = `
        <div class="container-fluid align-self-center">
          <div class="h1 text-center">Session Expired. Please <a style="text-decoration:underline" href="../Auth/signin-signup.html">LogIn</a> again.</div>
        </div>`;
  }

  console.log("user:", user);
};

function follower_openModal() {
  document.getElementById("followers-popup").style.display = "block";
}

function following_openModal() {
  document.getElementById("followings-popup").style.display = "block";
}

const limitthevisibilitychar = (count, id) => {
  const cnt = document.getElementById(id).innerText;
  if (cnt.length > count) {
    const idcontainer = document.getElementById(id);
    idcontainer.innerText = cnt.slice(0, count) + "...";
  }
};

// followers

// limitthevisibilitychar(15, "suggest-user1");
// limitthevisibilitychar(15, "suggest-user2");
// limitthevisibilitychar(15, "suggest-user3");
// limitthevisibilitychar(15, "suggest-user4");
// limitthevisibilitychar(15, "suggest-user5");

// // followings
// limitthevisibilitychar(15, "suggest-user6");
// limitthevisibilitychar(15, "suggest-user7");
// limitthevisibilitychar(15, "suggest-user8");
// limitthevisibilitychar(15, "suggest-user9");
// limitthevisibilitychar(15, "suggest-user10");

const logout = document.getElementById("logout");
logout.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.location.href = "../Auth/signin-signup.html";
});

function showPage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("main-content").style.display = "block";
}

function copyclicpboard(id) {
  // take n-1 characters from id
  const pollid = id.slice(0, id.length - 1);
  console.log(pollid);
  navigator.clipboard.writeText(
    `http://localhost:5500/poll.html?pollid=${pollid}`
  );
  let btn = document.getElementById(id);
  btn.innerText = "Copied!";
  window.setTimeout(() => {
    btn.innerText = "Copy";
  }, 5000);
}

// displaying user polls
async function getAllpolls() {
  const token = JSON.parse(localStorage.getItem("token"));
  let url = window.location.href;
  let urlArray = url.split("=");
  const otherUsername = urlArray[urlArray.length - 1];
  const response = await fetch(
    `https://quickpolls-2zqu.onrender.com/api/getallpollsbyuser`,
    {
      method: "POST",
      headers: {
        Accept: "applicaiton/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        username: otherUsername,
      }),
      withCredentials: true, // should be there
      credentials: "include", // should be there
    }
  );
  console.log(response.status);
  const data = await response.json();

  const polls = data.polls;

  if (polls.length == 0) {
    document.getElementById(
      "surveys"
    ).innerHTML += `<h4 class="text-center my-3">No surveys or polls created.</h4>`;
  }

  let i = 1;
  //   let user = JSON.parse(localStorage.getItem("user"));
  //   user = data.user;
  //   localStorage.setItem("user", JSON.stringify(user));
  polls.forEach(async (poll) => {
    // console.log(poll);
    const pollResponses = await getResponses(poll._id);
    // console.log(pollResponses);

    document.getElementsByClassName(
      "polls"
    )[0].innerHTML += `<div class="col poll d-flex justify-content-center">
      <div class="card" style="width: 18rem;">
        <div class="card-body" style = "display: flex; flex-direction: column; justify-content: space-evenly">
          <h5 class="card-title">${poll.title}</h5>
          <p class="card-text">${poll.description}</p>
          <p class="card-text"><b>Responses: </b>${pollResponses}</p>
        </div>
      </div>
    </div>`;
    i++;
  });
}

async function getResponses(pollid) {
  const token = JSON.parse(localStorage.getItem("token"));
  const username = JSON.parse(localStorage.getItem("user")).username;
  const response = await fetch(
    "https://quickpolls-2zqu.onrender.com/api/getdetailsaboutPoll",
    {
      method: "POST",
      headers: {
        Accept: "applicaiton/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        pollid: pollid,
      }),
      withCredentials: true, // should be there
      credentials: "include", // should be there
    }
  );
  console.log(response.status);
  const data = await response.json();
  //   console.log(data);

  if (response.status === 200) {
    return data.pollanalysisobj[data.pollanalysisobj.length - 1].responses
      .length;
  } else {
    return 0;
  }
}

const followbtn = document.getElementById("follow-btn");

const facebook = document.getElementById("facebbokimg");
const twitter = document.getElementById("twitterimg");
const instagram = document.getElementById("instagramimg");

facebook.addEventListener("click", () => {
  window.open(JSON.parse(localStorage.getItem("user")).facebook, "_blank");
});

twitter.addEventListener("click", () => {
  window.open(JSON.parse(localStorage.getItem("user")).twitter, "_blank");
});

instagram.addEventListener("click", () => {
  window.open(JSON.parse(localStorage.getItem("user")).instagram, "_blank");
});

// get followings list of the user
async function getFollowings() {
  const token = JSON.parse(localStorage.getItem("token"));
  const response = await fetch(
    `https://quickpolls-2zqu.onrender.com/api/following`,
    {
      method: "POST",
      headers: {
        Accept: "applicaiton/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
      }),
      withCredentials: true, // should be there
      credentials: "include", // should be there
    }
  );
  console.log(response.status);
  const data = await response.json();

  const followings = data.following;
  console.log(followings);

  document.getElementById("following_list").innerHTML = "";

  followings.forEach((following) => {
    console.log(following.username);

    document.getElementById("following_list").innerHTML += `
      <div class="user-suggestion-1">
                        <div>
                          <img src="../images/profileimg.png" class="user-profile-img-1" alt="profileimg">
                        </div>
                        <div class="right-user-suggestion-1">
                          <p class="right-user-suggestion-1-name" id="suggest-user6" style="font-size: 17px;">${following.name}</p>
                          <p class="right-user-suggestion-1-username shadow-color" style="font-size: 15px;">@${following.username}</p>
                        </div>
                      </div>
                      <hr />
      `;
  });
}

getFollowings();

// get followers list of the user
async function getFollowers() {
  const token = JSON.parse(localStorage.getItem("token"));
  const response = await fetch(
    "https://quickpolls-2zqu.onrender.com/api/followers",
    {
      method: "POST",
      headers: {
        Accept: "applicaiton/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
      }),
      withCredentials: true, // should be there
      credentials: "include", // should be there
    }
  );
  console.log(response.status);
  const data = await response.json();

  const followers = data.followers;
  console.log(followers);

  document.getElementById("followers_list").innerHTML = "";

  followers.forEach((follower) => {
    console.log(follower.username);

    document.getElementById("followers_list").innerHTML += `
      <div class="user-suggestion-1">
                        <div>
                          <img src="../images/profileimg.png" class="user-profile-img-1" alt="profileimg">
                        </div>
                        <div class="right-user-suggestion-1">
                          <p class="right-user-suggestion-1-name" id="suggest-user6" style="font-size: 17px;">${follower.name}</p>
                          <p class="right-user-suggestion-1-username shadow-color" style="font-size: 15px;">@${follower.username}</p>
                        </div>
                      </div>
                      <hr />
      `;
  });
}

getFollowers();

/****** follower and following page */

async function followUser() {
  let url = window.location.href;
  let urlArray = url.split("=");
  const otherUsername = urlArray[urlArray.length - 1];
  let currentUser = JSON.parse(localStorage.getItem("user"))._id;

  const token = JSON.parse(localStorage.getItem("token"));
  const response = await fetch(
    `https://quickpolls-2zqu.onrender.com/api/follow/${otherUsername}`,
    {
      method: "POST",
      headers: {
        Accept: "applicaiton/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
      }),
      withCredentials: true, // should be there
      credentials: "include", // should be there
    }
  );
  console.log(response.status);
  const data = await response.json();
  alert(data.message);
}

async function unfollowUser() {
  let url = window.location.href;
  let urlArray = url.split("=");
  const otherUsername = urlArray[urlArray.length - 1];
  let currentUser = JSON.parse(localStorage.getItem("user"))._id;

  const token = JSON.parse(localStorage.getItem("token"));
  const response = await fetch(
    `https://quickpolls-2zqu.onrender.com/api/unfollow/${otherUsername}`,
    {
      method: "POST",
      headers: {
        Accept: "applicaiton/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
      }),
      withCredentials: true, // should be there
      credentials: "include", // should be there
    }
  );
  console.log(response.status);
  const data = await response.json();
  alert(data.message);
}
