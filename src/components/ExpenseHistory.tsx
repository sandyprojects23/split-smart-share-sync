
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Expense } from "@/pages/Index";
import { Calendar, User as UserIcon, DollarSign, Tag } from "lucide-react";

interface ExpenseHistoryProps {
  expenses: Expense[];
  users: User[];
}

export const ExpenseHistory: React.FC<ExpenseHistoryProps> = ({ expenses, users }) => {
  const getUserName = (userId: string) => {
    return users.find(u => u.id === userId)?.name || 'Unknown User';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Food & Dining': 'bg-orange-100 text-orange-800',
      'Transportation': 'bg-blue-100 text-blue-800',
      'Shopping': 'bg-purple-100 text-purple-800',
      'Entertainment': 'bg-pink-100 text-pink-800',
      'Bills & Utilities': 'bg-yellow-100 text-yellow-800',
      'Travel': 'bg-green-100 text-green-800',
      'Healthcare': 'bg-red-100 text-red-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['Other'];
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No expenses yet</p>
        <p className="text-gray-400 text-sm">Add your first expense to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {expenses.map(expense => (
        <Card key={expense.id} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {expense.description}
                  </h3>
                  <Badge className={`text-xs ${getCategoryColor(expense.category)}`}>
                    <Tag className="h-3 w-3 mr-1" />
                    {expense.category}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <UserIcon className="h-4 w-4" />
                    <span>Paid by {getUserName(expense.paidBy)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(expense.date)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {expense.participants.map(participant => (
                    <div
                      key={participant.userId}
                      className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-full text-sm"
                    >
                      <span className="text-gray-700">{getUserName(participant.userId)}</span>
                      <span className="text-gray-500">•</span>
                      <span className="font-medium text-green-600">
                        ₹{participant.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-right ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  ₹{expense.amount.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">
                  {expense.splitType === 'equal' ? 'Split Equally' : 'Custom Split'}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {expense.participants.length} participant{expense.participants.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
