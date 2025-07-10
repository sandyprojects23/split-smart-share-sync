
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { User, Expense } from "@/pages/Index";
import { Calculator, Users, DollarSign } from "lucide-react";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  users: User[];
}

const categories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Travel',
  'Healthcare',
  'Other'
];

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onAddExpense,
  users
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [category, setCategory] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [customAmounts, setCustomAmounts] = useState<{ [userId: string]: string }>({});

  const handleParticipantToggle = (userId: string) => {
    setSelectedParticipants(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCustomAmountChange = (userId: string, value: string) => {
    setCustomAmounts(prev => ({
      ...prev,
      [userId]: value
    }));
  };

  const calculateEqualSplit = () => {
    if (!amount || selectedParticipants.length === 0) return 0;
    return parseFloat(amount) / selectedParticipants.length;
  };

  const getTotalCustomAmount = () => {
    return selectedParticipants.reduce((total, userId) => {
      return total + (parseFloat(customAmounts[userId] || '0') || 0);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !paidBy || !category || selectedParticipants.length === 0) {
      return;
    }

    let participants;
    if (splitType === 'equal') {
      const splitAmount = calculateEqualSplit();
      participants = selectedParticipants.map(userId => ({
        userId,
        amount: splitAmount
      }));
    } else {
      participants = selectedParticipants.map(userId => ({
        userId,
        amount: parseFloat(customAmounts[userId] || '0') || 0
      }));
    }

    const expense: Omit<Expense, 'id' | 'createdAt'> = {
      description,
      amount: parseFloat(amount),
      paidBy,
      splitType,
      participants,
      category,
      date: new Date()
    };

    onAddExpense(expense);
    
    // Reset form
    setDescription('');
    setAmount('');
    setPaidBy('');
    setSplitType('equal');
    setCategory('');
    setSelectedParticipants([]);
    setCustomAmounts({});
    onClose();
  };

  const isFormValid = description && amount && paidBy && category && selectedParticipants.length > 0 &&
    (splitType === 'equal' || Math.abs(getTotalCustomAmount() - parseFloat(amount || '0')) < 0.01);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <DollarSign className="h-6 w-6 text-blue-600" />
            <span>Add New Expense</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What was this expense for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Paid By */}
          <div className="space-y-2">
            <Label>Paid By</Label>
            <Select value={paidBy} onValueChange={setPaidBy}>
              <SelectTrigger>
                <SelectValue placeholder="Who paid for this expense?" />
              </SelectTrigger>
              <SelectContent>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Split Type */}
          <div className="space-y-4">
            <Label>Split Type</Label>
            <RadioGroup
              value={splitType}
              onValueChange={(value) => setSplitType(value as 'equal' | 'custom')}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="equal" id="equal" />
                <Label htmlFor="equal" className="flex items-center space-x-2 cursor-pointer">
                  <Calculator className="h-4 w-4" />
                  <span>Split Equally</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="flex items-center space-x-2 cursor-pointer">
                  <Users className="h-4 w-4" />
                  <span>Custom Split</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Participants */}
          <div className="space-y-4">
            <Label>Split Between</Label>
            <div className="grid grid-cols-1 gap-3">
              {users.map(user => (
                <Card 
                  key={user.id} 
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedParticipants.includes(user.id) 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleParticipantToggle(user.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full border-2 ${
                          selectedParticipants.includes(user.id) 
                            ? 'bg-blue-500 border-blue-500' 
                            : 'border-gray-300'
                        }`} />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      
                      {selectedParticipants.includes(user.id) && (
                        <div className="text-right">
                          {splitType === 'equal' ? (
                            <div className="text-lg font-semibold text-green-600">
                              ₹{calculateEqualSplit().toFixed(2)}
                            </div>
                          ) : (
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={customAmounts[user.id] || ''}
                              onChange={(e) => handleCustomAmountChange(user.id, e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-20 text-right"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Summary */}
          {selectedParticipants.length > 0 && (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-blue-600">₹{amount || '0.00'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {splitType === 'equal' ? 'Per Person' : 'Custom Total'}
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      ₹{splitType === 'equal' 
                        ? calculateEqualSplit().toFixed(2) 
                        : getTotalCustomAmount().toFixed(2)
                      }
                    </p>
                  </div>
                </div>
                {splitType === 'custom' && Math.abs(getTotalCustomAmount() - parseFloat(amount || '0')) > 0.01 && (
                  <p className="text-red-500 text-sm mt-2">
                    ⚠️ Custom amounts don't match total expense
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Add Expense
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
