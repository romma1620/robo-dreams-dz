export class BrewsController {
  constructor(brewsService) {
    this.brewsService = brewsService;
  }

  getAll(req, res) {
    const filter = {
      method: req.query.method,
      ratingMin: req.query.ratingMin ? Number(req.query.ratingMin) : undefined,
    };
    const list = this.brewsService.getAll(filter);
    res.json(list);
  }

  getById(req, res) {
    const brew = this.brewsService.getById(req.params.id);
    if (!brew) return res.sendStatus(404);
    res.json(brew);
  }

  create(req, res) {
    try {
      const created = this.brewsService.create(req.body);
      res.status(201).json(created);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  update(req, res) {
    const updated = this.brewsService.update(req.params.id, req.body);
    if (!updated) return res.sendStatus(404);
    res.json(updated);
  }

  delete(req, res) {
    const success = this.brewsService.delete(req.params.id);
    if (!success) return res.sendStatus(404);
    res.sendStatus(204);
  }
}
