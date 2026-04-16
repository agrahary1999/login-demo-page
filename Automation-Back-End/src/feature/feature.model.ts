import mongoose, { Schema, Document } from 'mongoose';

export interface IFeature extends Document {
  userId: string;
  projectId: string;
  name: string;
  description: string;
  status: 'CREATED' | 'QA' | 'QA_APPROVED' | 'DEV' | 'PLAN_APPROVED' | 'CODE_GEN' | 'PR_CREATED' | 'DONE';
  createdAt: Date;
  updatedAt: Date;
}

const featureSchema = new Schema<IFeature>(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    projectId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['CREATED', 'QA', 'QA_APPROVED', 'DEV', 'PLAN_APPROVED', 'CODE_GEN', 'PR_CREATED', 'DONE'],
      default: 'CREATED'
    }
  },
  {
    timestamps: true
  }
);

featureSchema.index({ userId: 1, status: 1 });
featureSchema.index({ userId: 1, updatedAt: -1 });

export const Feature = mongoose.model<IFeature>('Feature', featureSchema);