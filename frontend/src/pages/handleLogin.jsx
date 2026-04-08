const handleLogin = async (e) => {
  e.preventDefault();
  setMsg("Logging in...");

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email.trim(),
        password: formData.password.trim(),
      }),
    });

    console.log("STATUS:", res.status);
    console.log("CONTENT-TYPE:", res.headers.get("content-type"));

    const rawText = await res.text();
    console.log("RAW RESPONSE:", rawText);

    let data = {};
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch (jsonError) {
      console.log("JSON PARSE ERROR:", jsonError);
      setMsg("Server returned invalid response");
      return;
    }

    console.log("LOGIN RESPONSE:", data);

    if (res.ok) {
      const userData = data.user || data;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("token", data.token || "");
      localStorage.setItem("userId", userData._id || "");

      setMsg("Login successful");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 400);
    } else {
      setMsg(data.message || "Login failed");
    }
  } catch (error) {
    console.log("LOGIN FRONTEND ERROR:", error);
    setMsg("Server error. Try again.");
  }
};