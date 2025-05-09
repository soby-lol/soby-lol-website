import { LoginReq } from "@/types/api";
import { APP_API_URL } from "@/types/common";

const GET = async (url:string, token?:string) => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  if (!!token) {
    headers.append("Authorization", `Bearer ${token}`);
  }
  const response = await fetch(`${APP_API_URL}${url}`, { method: 'GET', headers: headers })
  return response;
}

const POST = async (url:string, payload:string, token?:string) => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  if (!!token) {
    headers.append("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${APP_API_URL}${url}`, {
    method: 'POST',
    headers: headers,
    body: payload,
  })

  return response;
}

const PUT = async (url:string, payload:string, token?:string) => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  if (!!token) {
    headers.append("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${APP_API_URL}${url}`, {
    method: 'PUT',
    headers: headers,
    body: payload,
  })

  return response;
}

export const requestLogin = async (address: string) => {
  return await POST(`/users/nonce/${address}`, "");
};


export const Login = async ({ address, signature}: LoginReq) => {
  const payload = JSON.stringify({
    address: address,
    signature: signature,
  });

  return await POST("/users/login", payload);
};

export const GetTaskCompleted = async (token: string) => {
  return await GET("/users/whitelist-steps", token);
};

export const pickTask = async (code:string, token:string) => {
  return await POST(`/users/task/${code}`, "", token);
};

export const registerWhitelist = async (token:string) => {
  return await POST(`/users/register-airdrop`, "", token);
};

export const TwitterCallback = async (code:string, token:string) => {
  return await POST(`/twitter/login/${code}`, "", token);
};

export const claimAirdrop = async(token?:string) => {
  return await POST(`/users/claim-airdrop`, "", token);
};

export const checkOnWhitelist = async(token?:string) => {
  return await POST(`/users/check-whitelist`, "", token);
};