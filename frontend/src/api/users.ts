const BASE_URL = "http://localhost:3000/api/users";

export async function findUsers(username: string) {
  console.log("Getting users with name: ", username)
  const res = await fetch(`${BASE_URL}/findUsers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
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