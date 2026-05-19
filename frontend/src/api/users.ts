const BASE_URL = "http://localhost:3000/api/users";

export async function findUsers(username: string) {
  const token = localStorage.getItem("token");
  console.log("Getting users with name: ", username)
  const res = await fetch(`${BASE_URL}/findUsers`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ username })
  });
  console.log(res);
  return res.json();
}

export async function getFriends() {
  const token = localStorage.getItem("token");
  console.log("Getting friends")
  const res = await fetch(`${BASE_URL}/getFriends`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({})
  });
  console.log(res);
  return res.json();
}

export async function getUsername(id: string) {
  const res = await fetch(`${BASE_URL}/getUser`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
  console.log(res);
  return res.json();
}

export async function getCurrUser() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/getCurrUser`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
     }
  });
  console.log(res);
  return res.json();
}

export async function getFavSongs(username: string) {
  const res = await fetch(`${BASE_URL}/${username}/top-tracks`);
  return res.json();
}

export async function getFavArtist(username: string) {
  const res = await fetch(`${BASE_URL}/${username}/top-artist`);
  return res.json();
}

export async function getListeningAge(username: string) {
  const res = await fetch(`${BASE_URL}/${username}/listening-age`);
  return res.json();
}

// isAdding is a boolean here to differentiate sending a friend req or removing a friend req
export async function handleFriendReq(recipient: string, isAdding: boolean) {
  const token = localStorage.getItem("token");
  console.log("Sending a friend request: ", isAdding)
  const res = await fetch(`${BASE_URL}/friendReq`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
     },
    body: JSON.stringify({ recipient, isAdding })
  });
  console.log(res);
  return res.json();
}

export async function addFriend( senderId: string, accepted: boolean ) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/addFriend`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
      },
    body: JSON.stringify({ senderId, accepted })
  });
  console.log(res);
  return res.json();
}
 
export async function getNotifications() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/getNotifs`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
      }
  });
  console.log(res);
  return res.json();
}

export async function register(username: string, email: string, password: string) {
  console.log("Calling register in users.ts");
  console.log(BASE_URL)
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password })
  });
  console.log(res);
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function makePrivate(update: boolean) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/makePrivate`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
      },
    body: JSON.stringify({ update })
  });
  console.log(res);
  return res.json();
}

export async function isPrivate(username: string) {
  const res = await fetch(`${BASE_URL}/${username}/isPrivate`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json"
      }
  });
  console.log(res);
  return res.json();
}

export async function updateBanner(file: string) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/updateBanner`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
      },
    body: JSON.stringify({ file })
  });
  console.log(res);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return res.json();
}

export async function updateAvatar(file: string) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/updateAvatar`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
      },
    body: JSON.stringify({ file })
  });
  console.log(res);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return res.json();
}

export async function fetchAvatar(username: string) {
    const res = await fetch(`${BASE_URL}/${username}/fetchAvatar`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json"
      }
  });
  console.log(res);
  return res.json();
}


export async function fetchBanner(username: string) {
    const res = await fetch(`${BASE_URL}/${username}/fetchBanner`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json"
      }
  });
  console.log(res);
  return res.json();
}


export async function updateDescription(description: string) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/updateDescription`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
      },
    body: JSON.stringify({ description })
  });
  console.log(res);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return res.json();
}

export async function fetchDescription(username: string) {
    const res = await fetch(`${BASE_URL}/${username}/fetchDescription`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json"
      }
  });
  console.log(res);
  return res.json();
}