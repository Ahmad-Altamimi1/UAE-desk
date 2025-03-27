const Fetch = () => {
  try {
    const res = await fetch("https://your-laravel-api-url/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await res.json();
    return data; // Respond back to the frontend with success response
  } catch (error) {
    console.error("Login failed", error);
    throw new Error("Login failed");
  }
};
