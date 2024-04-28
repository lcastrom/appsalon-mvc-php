<h1 class="nombre-pagina">Olvide Password</h1>
<p class="descripcion-pagina">Reestablece tu password escribiendo tu email a continuación</p>
<?php include_once __DIR__ . '/../templates/alertas.php' ;?>

<form action="/olvide" class="formulario" method="POST">
    <div class="campo">
        <label for="email">Email</label>
        <input
            type="email"
            id="email"
            name="email"
            placeholder="Tu Email"
        />
        <input type="submit" class="boton" value="Ennviar Instrucciones"> 
    </div>
</form>
<div class="acciones">
    <a href="/">¿Ya tiene una Cuenta. Inicia Sesión</a>
    <a href="/crear-cuenta">¿Aún no tienes una cuenta?</a>
</div>