import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { users } from '../store';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store the new user
    const newUser = { email, password: hashedPassword };
    users.push(newUser);

    console.log('Users:', users); // For debugging purposes

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
