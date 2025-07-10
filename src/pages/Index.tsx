
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Receipt, TrendingUp, ArrowUpDown } from "lucide-react";
import { AddExpenseModal } from "@/components/AddExpenseModal";
import { ExpenseHistory } from "@/components/ExpenseHistory";
import { UserBalances } from "@/components/UserBalances";
import { UserManagement } from "@/components/UserManagement";
import { toast } from "@/hooks/use-toast";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  splitType: 'equal' | 'custom';
  participants: { userId: string; amount: number }[];
  category: string;
  date: Date;
  createdAt: Date;
}

export interface Balance {
  userId: string;
  owes: { [userId: string]: number };
  owedBy: { [userId: string]: number };
  netBalance: number;
}

const Index = () => {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Alex Chen', email: 'alex@example.com' },
    { id: '2', name: 'Sarah Kim', email: 'sarah@example.com' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com' },
  ]);
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'balances' | 'users'>('overview');

  // Calculate balances whenever expenses change
  useEffect(() => {
    calculateBalances();
  }, [expenses, users]);

  const calculateBalances = () => {
    const newBalances: Balance[] = users.map(user => ({
      userId: user.id,
      owes: {},
      owedBy: {},
      netBalance: 0
    }));

    expenses.forEach(expense => {
      const payer = expense.paidBy;
      expense.participants.forEach(participant => {
        if (participant.userId !== payer) {
          const payerBalance = newBalances.find(b => b.userId === payer);
          const participantBalance = newBalances.find(b => b.userId === participant.userId);
          
          if (payerBalance && participantBalance) {
            if (!payerBalance.owedBy[participant.userId]) {
              payerBalance.owedBy[participant.userId] = 0;
            }
            if (!participantBalance.owes[payer]) {
              participantBalance.owes[payer] = 0;
            }
            
            payerBalance.owedBy[participant.userId] += participant.amount;
            participantBalance.owes[payer] += participant.amount;
          }
        }
      });
    });

    // Calculate net balances
    newBalances.forEach(balance => {
      const totalOwed = Object.values(balance.owedBy).reduce((sum, amount) => sum + amount, 0);
      const totalOwes = Object.values(balance.owes).reduce((sum, amount) => sum + amount, 0);
      balance.netBalance = totalOwed - totalOwes;
    });

    setBalances(newBalances);
  };

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setExpenses(prev => [newExpense, ...prev]);
    toast({
      title: "Expense Added Successfully",
      description: `${expense.description} for ₹${expense.amount.toFixed(2)}`,
    });
  };

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString()
    };
    setUsers(prev => [...prev, newUser]);
    toast({
      title: "User Added",
      description: `${user.name} has been added to the group`,
    });
  };

  const removeUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    setExpenses(prev => prev.filter(e => 
      e.paidBy !== userId && !e.participants.some(p => p.userId === userId)
    ));
    toast({
      title: "User Removed",
      description: "User has been removed from the group",
    });
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const myBalance = balances.find(b => b.userId === '1')?.netBalance || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <ArrowUpDown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ExpenseShare
                </h1>
                <p className="text-sm text-gray-500">Split expenses with friends</p>
              </div>
            </div>
            <Button
              onClick={() => setIsAddExpenseOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'expenses', label: 'Expenses', icon: Receipt },
            { id: 'balances', label: 'Balances', icon: ArrowUpDown },
            { id: 'users', label: 'Users', icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-blue-100">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">₹{totalExpenses.toFixed(2)}</div>
                  <p className="text-sm text-blue-100 mt-1">{expenses.length} transactions</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-purple-100">Your Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${myBalance >= 0 ? 'text-green-100' : 'text-red-100'}`}>
                    ₹{Math.abs(myBalance).toFixed(2)}
                  </div>
                  <p className="text-sm text-purple-100 mt-1">
                    {myBalance >= 0 ? 'You are owed' : 'You owe'}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-green-100">Group Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{users.length}</div>
                  <p className="text-sm text-green-100 mt-1">Active members</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Receipt className="h-5 w-5 text-blue-600" />
                    <span>Recent Expenses</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ExpenseHistory expenses={expenses.slice(0, 5)} users={users} />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span>Balance Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <UserBalances balances={balances} users={users} />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'expenses' && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Receipt className="h-5 w-5 text-blue-600" />
                <span>All Expenses</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseHistory expenses={expenses} users={users} />
            </CardContent>
          </Card>
        )}

        {activeTab === 'balances' && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ArrowUpDown className="h-5 w-5 text-purple-600" />
                <span>User Balances</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UserBalances balances={balances} users={users} detailed />
            </CardContent>
          </Card>
        )}

        {activeTab === 'users' && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-600" />
                <span>Manage Users</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UserManagement users={users} onAddUser={addUser} onRemoveUser={removeUser} />
            </CardContent>
          </Card>
        )}
      </div>

      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onAddExpense={addExpense}
        users={users}
      />
    </div>
  );
};

export default Index;
