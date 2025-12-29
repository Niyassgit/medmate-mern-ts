export interface Feature {
  id: string;
  key: string;
  description: string;
  createdAt: Date;
}

export interface CreateFeaturePayload {
  key: string;
  description: string;
}

export interface UpdateFeaturePayload {
  key?: string;
  description?: string;
}

