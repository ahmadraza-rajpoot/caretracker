type SignupData = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export function validateSignup(data: SignupData): string | null {
  if (!data.name.trim()) {
    return "Name is required"
  }

  if (!data.email.trim()) {
    return "Email is required"
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return "Please enter a valid email"
  }

  if (data.password.length < 8) {
    return "Password must be at least 8 characters"
  }

  if (data.password !== data.confirmPassword) {
    return "Passwords do not match"
  }

  return null
}

type loginData ={
    email:string,
    password:string,
}

export function validateLogin(data: loginData): string | null {


  if (!data.email.trim()) {
    return "Email is required"
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return "Please enter a valid email"
  }

  if (data.password.length < 8) {
    return "Password must be at least 8 characters"
  }

  return null
}