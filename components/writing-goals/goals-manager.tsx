"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Target, Plus, MoreVertical, Edit3, Trash2, Calendar, TrendingUp, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { WritingGoals } from "@/lib/types";

interface WritingGoal {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly' | 'project';
  target: number;
  current: number;
  unit: 'words' | 'pages' | 'scenes' | 'chapters';
  deadline?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface GoalsManagerProps {
  goals: WritingGoal[];
  onGoalCreate: (goal: Omit<WritingGoal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onGoalUpdate: (id: string, updates: Partial<WritingGoal>) => void;
  onGoalDelete: (id: string) => void;
  onProgressUpdate: (id: string, progress: number) => void;
  className?: string;
}

const goalTypes = [
  { value: 'daily', label: 'Diária', icon: '📅' },
  { value: 'weekly', label: 'Semanal', icon: '📊' },
  { value: 'monthly', label: 'Mensal', icon: '🗓️' },
  { value: 'project', label: 'Projeto', icon: '🎯' },
] as const;

const goalUnits = [
  { value: 'words', label: 'Palavras', shortLabel: 'palavras' },
  { value: 'pages', label: 'Páginas', shortLabel: 'páginas' },
  { value: 'scenes', label: 'Cenas', shortLabel: 'cenas' },
  { value: 'chapters', label: 'Capítulos', shortLabel: 'capítulos' },
] as const;

interface GoalFormProps {
  goal?: WritingGoal;
  onSave: (goal: Omit<WritingGoal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

function GoalForm({ goal, onSave, onCancel }: GoalFormProps) {
  const [formData, setFormData] = React.useState({
    title: goal?.title || '',
    type: goal?.type || 'daily' as const,
    target: goal?.target || 1000,
    current: goal?.current || 0,
    unit: goal?.unit || 'words' as const,
    deadline: goal?.deadline ? goal.deadline.toISOString().split('T')[0] : '',
    isActive: goal?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      deadline: formData.deadline ? new Date(formData.deadline) : undefined,
    });
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título da Meta</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          placeholder="Ex: Meta diária de escrita"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <Select value={formData.type} onValueChange={(value) => handleFieldChange('type', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {goalTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    <span>{type.icon}</span>
                    {type.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unidade</Label>
          <Select value={formData.unit} onValueChange={(value) => handleFieldChange('unit', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {goalUnits.map((unit) => (
                <SelectItem key={unit.value} value={unit.value}>
                  {unit.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="target">Meta</Label>
          <Input
            id="target"
            type="number"
            value={formData.target}
            onChange={(e) => handleFieldChange('target', parseInt(e.target.value) || 0)}
            min="1"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="current">Progresso Atual</Label>
          <Input
            id="current"
            type="number"
            value={formData.current}
            onChange={(e) => handleFieldChange('current', parseInt(e.target.value) || 0)}
            min="0"
          />
        </div>
      </div>

      {(formData.type === 'project' || formData.type === 'monthly') && (
        <div className="space-y-2">
          <Label htmlFor="deadline">Prazo (opcional)</Label>
          <Input
            id="deadline"
            type="date"
            value={formData.deadline}
            onChange={(e) => handleFieldChange('deadline', e.target.value)}
          />
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {goal ? 'Atualizar' : 'Criar'} Meta
        </Button>
      </div>
    </form>
  );
}

interface GoalCardProps {
  goal: WritingGoal;
  onEdit: () => void;
  onDelete: () => void;
  onProgressUpdate: (progress: number) => void;
}

function GoalCard({ goal, onEdit, onDelete, onProgressUpdate }: GoalCardProps) {
  const [isUpdatingProgress, setIsUpdatingProgress] = React.useState(false);
  const [newProgress, setNewProgress] = React.useState(goal.current);
  
  const typeConfig = goalTypes.find(t => t.value === goal.type);
  const unitConfig = goalUnits.find(u => u.value === goal.unit);
  const progressPercentage = Math.min((goal.current / goal.target) * 100, 100);
  const isCompleted = goal.current >= goal.target;
  const isOverdue = goal.deadline && new Date() > goal.deadline && !isCompleted;

  const handleProgressSubmit = () => {
    onProgressUpdate(newProgress);
    setIsUpdatingProgress(false);
  };

  const getStatusColor = () => {
    if (isCompleted) return 'text-green-600 dark:text-green-400';
    if (isOverdue) return 'text-red-600 dark:text-red-400';
    if (progressPercentage > 75) return 'text-blue-600 dark:text-blue-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getProgressColor = () => {
    if (isCompleted) return 'bg-green-500';
    if (isOverdue) return 'bg-red-500';
    if (progressPercentage > 75) return 'bg-blue-500';
    return 'bg-gray-500';
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg",
      !goal.isActive && "opacity-60",
      isCompleted && "ring-2 ring-green-500/20"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate flex items-center gap-2">
              <span>{typeConfig?.icon}</span>
              {goal.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={goal.isActive ? "default" : "secondary"}>
                {typeConfig?.label}
              </Badge>
              {isCompleted && (
                <Badge className="bg-green-500 text-white">
                  <Award className="h-3 w-3 mr-1" />
                  Concluída
                </Badge>
              )}
              {isOverdue && (
                <Badge variant="destructive">
                  Atrasada
                </Badge>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsUpdatingProgress(true)}>
                <TrendingUp className="h-3 w-3 mr-2" />
                Atualizar Progresso
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Edit3 className="h-3 w-3 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600 dark:text-red-400">
                <Trash2 className="h-3 w-3 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className={getStatusColor()}>
              {goal.current} / {goal.target} {unitConfig?.shortLabel}
            </span>
            <span className={getStatusColor()}>
              {progressPercentage.toFixed(0)}%
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2"
          />
        </div>

        {/* Deadline */}
        {goal.deadline && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="h-3 w-3" />
            <span>
              Prazo: {goal.deadline.toLocaleDateString('pt-BR')}
            </span>
          </div>
        )}

        {/* Quick Progress Update */}
        {isUpdatingProgress && (
          <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-800 rounded">
            <Label htmlFor="progress">Novo progresso</Label>
            <div className="flex gap-2">
              <Input
                id="progress"
                type="number"
                value={newProgress}
                onChange={(e) => setNewProgress(parseInt(e.target.value) || 0)}
                min="0"
                className="flex-1"
              />
              <Button size="sm" onClick={handleProgressSubmit}>
                Salvar
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  setIsUpdatingProgress(false);
                  setNewProgress(goal.current);
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface StatsCardProps {
  goals: WritingGoal[];
}

function StatsCard({ goals }: StatsCardProps) {
  const activeGoals = goals.filter(g => g.isActive);
  const completedGoals = activeGoals.filter(g => g.current >= g.target);
  const overdueGoals = activeGoals.filter(g => 
    g.deadline && new Date() > g.deadline && g.current < g.target
  );
  
  const totalProgress = activeGoals.length > 0 
    ? activeGoals.reduce((sum, goal) => sum + Math.min((goal.current / goal.target) * 100, 100), 0) / activeGoals.length
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Estatísticas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {completedGoals.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Metas Concluídas
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {activeGoals.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Metas Ativas
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso Geral</span>
            <span>{totalProgress.toFixed(0)}%</span>
          </div>
          <Progress value={totalProgress} className="h-2" />
        </div>
        
        {overdueGoals.length > 0 && (
          <div className="text-center">
            <div className="text-lg font-bold text-red-600 dark:text-red-400">
              {overdueGoals.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Metas Atrasadas
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function GoalsManager({
  goals,
  onGoalCreate,
  onGoalUpdate,
  onGoalDelete,
  onProgressUpdate,
  className,
}: GoalsManagerProps) {
  const [editingGoal, setEditingGoal] = React.useState<WritingGoal | null>(null);
  const [isCreating, setIsCreating] = React.useState(false);
  const [filterType, setFilterType] = React.useState<string>('all');
  const [showCompleted, setShowCompleted] = React.useState(true);

  const filteredGoals = goals.filter(goal => {
    if (filterType !== 'all' && goal.type !== filterType) return false;
    if (!showCompleted && goal.current >= goal.target) return false;
    return true;
  });

  const handleCreate = (goalData: Omit<WritingGoal, 'id' | 'createdAt' | 'updatedAt'>) => {
    onGoalCreate(goalData);
    setIsCreating(false);
  };

  const handleUpdate = (goalData: Omit<WritingGoal, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingGoal) {
      onGoalUpdate(editingGoal.id, goalData);
      setEditingGoal(null);
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-gray-50 dark:bg-gray-900", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Metas de Escrita
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {goals.length} metas • {goals.filter(g => g.current >= g.target).length} concluídas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {goalTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant={showCompleted ? "default" : "outline"}
            size="sm"
            onClick={() => setShowCompleted(!showCompleted)}
          >
            {showCompleted ? "Ocultar" : "Mostrar"} Concluídas
          </Button>
          <Button onClick={() => setIsCreating(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Meta
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Stats Card */}
          <div className="lg:col-span-1">
            <StatsCard goals={goals} />
          </div>
          
          {/* Goals Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={() => setEditingGoal(goal)}
                  onDelete={() => onGoalDelete(goal.id)}
                  onProgressUpdate={(progress) => onProgressUpdate(goal.id, progress)}
                />
              ))}
            </div>
            
            {filteredGoals.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <Target className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-sm text-center">
                  {filterType === 'all' 
                    ? 'Nenhuma meta criada ainda.\nClique em "Nova Meta" para começar.'
                    : 'Nenhuma meta encontrada para este filtro.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova Meta de Escrita</DialogTitle>
          </DialogHeader>
          <GoalForm
            onSave={handleCreate}
            onCancel={() => setIsCreating(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingGoal} onOpenChange={() => setEditingGoal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Meta</DialogTitle>
          </DialogHeader>
          {editingGoal && (
            <GoalForm
              goal={editingGoal}
              onSave={handleUpdate}
              onCancel={() => setEditingGoal(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}