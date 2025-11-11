import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignupMutation } from '../../api/auth';
import { useNavigate, Link } from 'react-router-dom';
import { signupSchema } from '../../validation';

type SignupFormData = z.infer<typeof signupSchema>;

const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const [signup, { isLoading }] = useSignupMutation();
  const navigate = useNavigate();

  const onSubmit = async (data: SignupFormData) => {
    try {
      await signup(data).unwrap();
      navigate('/login');
    } catch (err: any) {
      console.error('Signup failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-[380px]">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              {...register('name')}
              placeholder="Enter your name"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register('email')}
              placeholder="Enter your email"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              {...register('password')}
              placeholder="Enter your password"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              defaultValue=""
              {...register('role')}
              className={`w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 ${
                errors.role ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            >
              <option value="" disabled>Select a role</option>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-lg text-white font-medium transition duration-200 ${
              isLoading
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import {
//   TextField,
//   Button,
//   Container,
//   Typography,
//   Box,
//   Paper,
//   MenuItem,
// } from '@mui/material';
// import { useSignupMutation } from '../../api/auth';
// import { useNavigate, Link } from 'react-router-dom';
// import { signupSchema } from '../../validation';






// type SignupFormData = z.infer<typeof signupSchema>;

// const Signup = () => {
//   const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
//     resolver: zodResolver(signupSchema),
//   });

//   const [signup, { isLoading }] = useSignupMutation();
//   const navigate = useNavigate();

//   const onSubmit = async (data: SignupFormData) => {
//     try {
//       await signup(data).unwrap();
//       // After signup → redirect to login
//       navigate('/login');
//     } catch (err: any) {
//       console.error('Signup failed:', err);
//     }
//   };

//   return (
//     <Container maxWidth="xs">
//       <Paper sx={{ p: 4, mt: 8, borderRadius: 3 }}>
//         <Typography variant="h5" textAlign="center" gutterBottom>
//           Create Account
//         </Typography>

//         <form onSubmit={handleSubmit(onSubmit)}>
//           <TextField
//             fullWidth
//             label="Name"
//             margin="normal"
//             {...register('name')}
//             error={!!errors.name}
//             helperText={errors.name?.message}
//           />
//           <TextField
//             fullWidth
//             label="Email"
//             margin="normal"
//             {...register('email')}
//             error={!!errors.email}
//             helperText={errors.email?.message}
//           />
//           <TextField
//             fullWidth
//             type="password"
//             label="Password"
//             margin="normal"
//             {...register('password')}
//             error={!!errors.password}
//             helperText={errors.password?.message}
//           />
//           <TextField
//             select
//             fullWidth
//             label="Role"
//             margin="normal"
//             defaultValue=""
//             {...register('role')}
//             error={!!errors.role}
//             helperText={errors.role?.message}
//           >
//             <MenuItem value="customer">Customer</MenuItem>
//             <MenuItem value="store">Store</MenuItem>
//           </TextField>

//           <Button
//             fullWidth
//             type="submit"
//             variant="contained"
//             sx={{ mt: 2 }}
//             disabled={isLoading}
//           >
//             {isLoading ? 'Signing up...' : 'Sign Up'}
//           </Button>
//         </form>

//         <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
//           Already have an account? <Link to="/login">Login</Link>
//         </Typography>
//       </Paper>
//     </Container>
//   );
// };

// export default Signup;
