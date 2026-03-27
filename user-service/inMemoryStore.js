// In-memory data store fallback when MongoDB is not available
// Useful for development/testing without MongoDB

class InMemoryStore {
  constructor() {
    this.users = [];
    this.idCounter = 1;
  }

  // Add a user
  async addUser(userData) {
    const user = {
      _id: this.idCounter++,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(user);
    return user;
  }

  // Find user by email
  async findByEmail(email) {
    return this.users.find(u => u.email === email);
  }

  // Get all users (without passwords)
  async getAllUsers() {
    return this.users.map(u => ({
      _id: u._id,
      email: u.email,
      name: u.name,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt
    }));
  }

  // Check if user exists by email
  async userExists(email) {
    return this.users.some(u => u.email === email);
  }

  // Verify user credentials
  async verifyUser(email, password) {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (!user) return null;
    
    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    };
  }
}

// Singleton instance
const store = new InMemoryStore();

module.exports = store;
