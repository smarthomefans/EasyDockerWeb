const express = require('express');
const router = express.Router();
const Docker = require('dockerode');
const docker = new Docker();

/* GET  overview. */
router.get('/overview', async (req, res, next) => {
    try {
        const info = await docker.info();
        return res.json(info);
    } catch (err) {
        res.json({
            msg: 'error',
            message: err.toString()
        });
    }
});

/**
 * containers list
 */
router.get('/containers', async (req, res, next) => {
    try {
        const listContainers = await docker.listContainers({all: true});
        return res.json(listContainers);
    } catch (err) {
        res.json({
            msg: 'error',
            message: err.toString()
        });
    }
});

router.get('/containers/start/:id', async (req, res, next) => {
    const container = docker.getContainer(req.params.id);
    try {
        await container.start();
        res.json({
            code: 200,
            msg: 'OK'
        });
    } catch (err) {
        res.json({
            code: 400,
            msg: err.toString()
        });
    }
});

router.get('/containers/stop/:id', async (req, res, next) => {
    const container = docker.getContainer(req.params.id);
    try {
        await container.stop();
        res.json({
            code: 200,
            msg: 'OK'
        });
    } catch (err) {
        res.json({
            code: 400,
            msg: err.toString()
        });
    }
});

router.get('/containers/remove/:id', (req, res, next) => {
    const container = docker.getContainer(req.params.id);
    container.remove({force: true}, (err, data) => {
        if (!err) {
            res.json({
                code: 200,
                msg: 'OK'
            });
        } else {
            res.json({
                code: 400,
                msg: err.toString()
            });
        }
    });
});

router.get('/images', async (req, res, next) => {
    try {
        const listImages = await docker.listImages();
        res.json(listImages);
    } catch (err) {
        res.json(err);
    }
});

router.get('/images/remove/:id', (req, res, next) => {
    let imageId = req.params.id;
    if (imageId.indexOf(':') > 0) {
        imageId = imageId.split(':')[1];
    }
    const image = docker.getImage(imageId);
    image.remove({force: true}, (err, data) => {
        if (err) {
            res.json(err);
        } else {
            res.json(data);
        }
    });
});

router.get('/search/:name', async (req, res, next) => {
    const name = req.params.name;
    try {
        const data = await docker.searchImages({term: name});
        return res.json(data);
    } catch (e) {
        return res.json(e);
    }
});

module.exports = router;
