import { UserProfile } from '../services/authService'
export const getUserProfile = async () => {
  const result = await UserProfile()
  return { result: result.profile }
}
