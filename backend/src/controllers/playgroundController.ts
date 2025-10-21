import { Request, Response } from 'express';
import Playground, { IPlayground } from '../models/Playground';

export const getAllPlaygrounds = async (req: Request, res: Response) => {
  try {
    const playgrounds = await Playground.find()
      .populate('author', 'username email')
      .sort({ createdAt: -1 });

    res.json(playgrounds);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlaygroundById = async (req: Request, res: Response) => {
  try {
    const playground = await Playground.findById(req.params.id)
      .populate('author', 'username email');

    if (!playground) {
      return res.status(404).json({ message: 'Playground not found' });
    }

    res.json(playground);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createPlayground = async (req: Request, res: Response) => {
  try {
    const { title, data, thumbnail, tags } = req.body;
    const userId = (req as any).userId;

    if (!title || !data) {
      return res.status(400).json({ message: 'Title and data are required' });
    }

    const playground = new Playground({
      title,
      author: userId,
      data,
      thumbnail,
      tags: tags || []
    });

    await playground.save();
    await playground.populate('author', 'username email');

    res.status(201).json({
      message: 'Playground created successfully',
      playground
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePlayground = async (req: Request, res: Response) => {
  try {
    const { title, data, thumbnail, tags } = req.body;
    const userId = (req as any).userId;

    const playground = await Playground.findById(req.params.id);

    if (!playground) {
      return res.status(404).json({ message: 'Playground not found' });
    }

    if (playground.author.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this playground' });
    }

    if (title) playground.title = title;
    if (data) playground.data = data;
    if (thumbnail !== undefined) playground.thumbnail = thumbnail;
    if (tags) playground.tags = tags;

    await playground.save();
    await playground.populate('author', 'username email');

    res.json({
      message: 'Playground updated successfully',
      playground
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePlayground = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const playground = await Playground.findById(req.params.id);

    if (!playground) {
      return res.status(404).json({ message: 'Playground not found' });
    }

    if (playground.author.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this playground' });
    }

    await Playground.findByIdAndDelete(req.params.id);

    res.json({ message: 'Playground deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};