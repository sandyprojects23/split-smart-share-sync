
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User } from "@/pages/Index";
import { Plus, UserPlus, Mail, Trash2, Users } from "lucide-react";

interface UserManagementProps {
  users: User[];
  onAddUser: (user: Omit<User, 'id'>) => void;
  onRemoveUser: (userId: string) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onAddUser,
  onRemoveUser
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      onAddUser({ name: name.trim(), email: email.trim() });
      setName('');
      setEmail('');
      setIsAddingUser(false);
    }
  };

  const handleRemoveUser = (userId: string) => {
    if (users.length <= 1) {
      alert('You need at least one user in the group');
      return;
    }
    if (confirm('Are you sure you want to remove this user? This will also remove all their associated expenses.')) {
      onRemoveUser(userId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add User Section */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <UserPlus className="h-5 w-5 text-blue-600" />
            <span>Add New Member</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isAddingUser ? (
            <Button
              onClick={() => setIsAddingUser(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Member
            </Button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddingUser(false);
                    setName('');
                    setEmail('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Add Member
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Current Users */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Users className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Current Members</h3>
          <Badge variant="secondary">{users.length}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((user, index) => (
            <Card key={user.id} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                        <span>{user.name}</span>
                        {index === 0 && (
                          <Badge variant="secondary" className="text-xs">
                            You
                          </Badge>
                        )}
                      </h4>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Mail className="h-3 w-3" />
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </div>

                  {users.length > 1 && index !== 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveUser(user.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Group Info */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-blue-50">
        <CardContent className="p-4">
          <div className="text-center">
            <h4 className="font-semibold text-gray-900 mb-2">Group Statistics</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-green-600">{users.length}</p>
                <p className="text-gray-500">Members</p>
              </div>
              <div>
                <p className="font-medium text-blue-600">Active</p>
                <p className="text-gray-500">Status</p>
              </div>
              <div>
                <p className="font-medium text-purple-600">Expense Sharing</p>
                <p className="text-gray-500">Mode</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
