import { psql } from '../main';
import { Request, Response } from 'express';

export async function allItems(req: Request, res: Response): Promise<unknown> {
    const { rows } = await psql.query('SELECT * FROM items;');
    return res.json({ status: 'success', items: rows });
}

export async function viewItem(req: Request, res: Response): Promise<unknown> {
    try {
        const rawId = req.params['id'];
        const id = parseInt(rawId);

        const { rows } = await psql.query(
            'SELECT * FROM items WHERE id = $1;', [id]);
        return res.json({ status: 'success', item: rows[0] });
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: 'Cannot retrieve item info'
        });
    }
}

export async function addItem(req: Request, res: Response): Promise<unknown> {
    const { body } = req;

    try {
        await psql.query(
            'INSERT INTO items (name, price, description) VALUES ($1, $2, $3);',
            [body.name, body.price, body.description]);

        return res.json({ status: 'success', message: 'Added new item' });
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: 'Cannot add new item'
        });
    }
}

export async function deleteItem(
    req: Request, res: Response): Promise<unknown> {
    try {
        const rawId = req.params['id'];
        const id = parseInt(rawId);

        await psql.query('DELETE FROM items WHERE id = $1;', [id]);
        return res.json({
            status: 'success',
            message: 'Successfully removed item'
        });
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: 'Cannot remove item'
        });
    }
}