import { apiClient } from './apiClient';
import type { WorkoutPlan, Exercise, User } from '@/types';

/**
 * AI Service for generating personalized workout and nutrition plans
 */
export class AIService {
  /**
   * Generate a personalized workout plan based on user profile
   */
  static async generateWorkoutPlan(user: Partial<User>): Promise<WorkoutPlan | null> {
    try {
      // In production, this would call an actual AI API (OpenAI, Anthropic, etc.)
      const response = await apiClient.post<WorkoutPlan>('/ai/workout-plan', {
        userId: user.id,
        goal: user.goal,
        fitnessLevel: user.fitnessLevel,
        age: user.age,
        weight: user.weight,
        height: user.height,
      });

      return response.data || null;
    } catch (error) {
      console.error('Failed to generate workout plan:', error);
      return null;
    }
  }

  /**
   * Get AI recommendations based on user's progress
   */
  static async getRecommendations(userId: string): Promise<string[]> {
    try {
      const response = await apiClient.get<{ recommendations: string[] }>(
        `/ai/recommendations/${userId}`
      );
      return response.data?.recommendations || [];
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      return [];
    }
  }

  /**
   * Analyze food image using AI
   */
  static async analyzeFoodImage(imageData: string): Promise<{
    foodName: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  } | null> {
    try {
      const response = await apiClient.post<{
        foodName: string;
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
      }>('/ai/analyze-food', {
        image: imageData,
      });

      return response.data || null;
    } catch (error) {
      console.error('Failed to analyze food:', error);
      return null;
    }
  }

  /**
   * Get personalized nutrition plan
   */
  static async generateNutritionPlan(user: Partial<User>): Promise<{
    dailyCalories: number;
    protein: number;
    carbs: number;
    fats: number;
  } | null> {
    try {
      const response = await apiClient.post<{
        dailyCalories: number;
        protein: number;
        carbs: number;
        fats: number;
      }>('/ai/nutrition-plan', {
        userId: user.id,
        goal: user.goal,
        weight: user.weight,
        height: user.height,
        age: user.age,
        gender: user.gender,
      });

      return response.data || null;
    } catch (error) {
      console.error('Failed to generate nutrition plan:', error);
      return null;
    }
  }

  /**
   * Adjust workout intensity based on performance
   */
  static async adjustWorkoutIntensity(
    workoutPlanId: string,
    performanceData: {
      completed: boolean;
      difficulty: 'too-easy' | 'just-right' | 'too-hard';
      fatigue: number; // 1-10
    }
  ): Promise<WorkoutPlan | null> {
    try {
      const response = await apiClient.post<WorkoutPlan>('/ai/adjust-workout', {
        workoutPlanId,
        performanceData,
      });

      return response.data || null;
    } catch (error) {
      console.error('Failed to adjust workout:', error);
      return null;
    }
  }

  /**
   * Get exercise form tips using AI
   */
  static async getExerciseFormTips(exerciseName: string): Promise<string[]> {
    try {
      const response = await apiClient.get<{ tips: string[] }>(
        `/ai/exercise-tips/${encodeURIComponent(exerciseName)}`
      );
      return response.data?.tips || [];
    } catch (error) {
      console.error('Failed to get exercise tips:', error);
      return [];
    }
  }

  /**
   * Predict weight loss timeline
   */
  static async predictWeightLoss(
    currentWeight: number,
    targetWeight: number,
    weeklyDeficit: number
  ): Promise<{
    estimatedWeeks: number;
    targetDate: Date;
    weeklyLoss: number;
  } | null> {
    try {
      const response = await apiClient.post<{
        estimatedWeeks: number;
        targetDate: string;
        weeklyLoss: number;
      }>('/ai/predict-weight-loss', {
        currentWeight,
        targetWeight,
        weeklyDeficit,
      });

      if (response.data) {
        return {
          ...response.data,
          targetDate: new Date(response.data.targetDate),
        };
      }
      return null;
    } catch (error) {
      console.error('Failed to predict weight loss:', error);
      return null;
    }
  }
}
