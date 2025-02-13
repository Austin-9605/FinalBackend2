// Middleware ADMIN
export function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Acceso denegado: esta acción es solo para administradores' });
}

// Middleware USER
export function isUser(req, res, next) {
    if (req.user && req.user.role === 'user') {
        return next();
    }
    return res.status(403).json({ message: 'Acceso denegado: esta acción es solo para usuarios' });
}
