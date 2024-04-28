<?php

namespace Controllers;

use Classes\Email;
use Model\Usuario;
use MVC\Router;

class LoginController{
    public static function login(Router $router){
        $alertas=[];
        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            $auth=new Usuario($_POST);
            $alertas = $auth->validarLogin();

            if(empty($alertas)){
                //comprobvar que exisra el usaurio
                $usuario=Usuario::where('email', $auth->email) ;
                if ($usuario){
                    //verirficar el password
                    if ($usuario->comprobarPasswordAndVerificado($auth->password)){
                        //autentical al usuario
                        session_unset();
                        session_start();

                        $_SESSION['id'] = $usuario->id;
                        $_SESSION['nombre'] = $usuario->nombre . $usuario->apellido;
                        $_SESSION['email'] = $usuario->email;
                        $_SESSION['login'] = true;
                        //redireccionamiento
                        if ($usuario->admin === "1"){
                            $_SESSION['admin'] = $usuario->admin ?? null;
                            header('Location: /admin');
                        }
                        else{
                            header('Location: /cita');
                        }
                    }
                }
                else{
                    Usuario::setAlerta('error','Usuario No encontrado');
                }
            }
        }
        $alertas=Usuario::getAlertas();
        $router->render('auth/login',[
                        'alertas' => $alertas
                        ]);

    }

    public static function logout(){
        session_start();

        $_SESSION=[];
        header('location: /');

        
    }

    public static function olvide(Router $router){
        //Alertas Vacias
        $alertas=[];
        if ($_SERVER['REQUEST_METHOD'] === 'POST'){
            $auth=new Usuario($_POST);
            $alertas = $auth->validarEmail();
            if (empty($alertas)){
                $usuario = Usuario::where('email', $auth->email);

                if ($usuario && $usuario->confirmado === "1"){
                    //generar un token
                    $usuario->crearToken();
                    $usuario->guardar();
                    //envier el email
                    $email = new Email($usuario->email, $usuario->nombre,$usuario->token);
                    $email->enviarInstrucciones();

                    //alerta de exito
                    Usuario::setAlerta('exito',"Revisa tu email");
                }else{
                    Usuario::setAlerta('error',"Usuaruio No existe o No está confirmado");
                }
            }
        }
        $alertas=Usuario::getAlertas();
       
        $router->render('auth/olvide-password',[
            'alertas' => $alertas
            ] );

    }

    public static function recuperar(Router $router){
        //Alertas Vacias
        $alertas=[];
        $error=false;
        $token=s($_GET['token']);
        
        //buscar usuario por su token
        $usuario = Usuario::where('token', $token);

        if (empty($usuario)){
            Usuario::setAlerta('error',"Token no valido");
            $error=true;

        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST'){
            //leer el nuevo passwoir y guardarlos
            $password=new Usuario($_POST);
            $alertas = $password->validarPassword();
            if (empty($alertas)){
                $usuario->password=null;
                $usuario->password=$password->password;
                $usuario->hashPassword();
                $usuario->token = null;
                $resultado = $usuario->guardar();
                if ($resultado){
                    header('Location: /');
                }
            }

        }
        $alertas=Usuario::getAlertas();
        $router->render('auth/recuperar-password',[
            'alertas' => $alertas,
            'error'=>$error
            ] );
    }
    public static function crear(Router $router){
        //Alertas Vacias
        $alertas=[];
        $usuario = new Usuario($_POST);
        if ($_SERVER['REQUEST_METHOD'] === 'POST'){
            $usuario->sincronizar($_POST);
            $alertas = $usuario->validarnuevacuenta();

            //revisar que alertas este vacio

            if (empty($alertas)){
                //verificar que el usuario no este registrado
                $resultado = $usuario->existeUsuario();
                if ($resultado->num_rows){
                    $alertas= Usuario::getAlertas();
                }
                else{
                    //no esta registrado
                    $usuario->hashPassword();
                    
                    //GENERAR UN TOKEN UNICO
                    $usuario->crearToken() ;
                    
                    //enviar email
                    $email = new Email($usuario->email, $usuario->nombre, $usuario->token  );
                    $email->enviarConfirmacion();
                    //cvrear el usuario
                    $resultado=$usuario->guardar();
                    if ($resultado){
                        header('Location: /mensaje');
                    }
                    //debuguear($email);
                }
            }
        }
        $router->render('auth/crear-cuenta', [
            'usuario' => $usuario,
            'alertas' => $alertas
        ]);
        
    }

    public static function mensaje(Router $router){
        $router->render('auth/mensaje');

    }

    public static function confirmar(Router $router){
        $alertas=[];
        $token= s($_GET['token']);
        $usuario=Usuario::where('token',$token);
        
        if (empty($usuario)){
            //Mostrar mensaje de error
            Usuario::setAlerta('error', 'Token No válido');
        }
        else{
            //modificar a usuario confirmado
            $usuario->confirmado="1";
            $usuario->token=null;
            $usuario->guardar();
            Usuario::setAlerta('exito', 'Cuenta Comprobada Correctamente');
        }

        $alertas=Usuario::getAlertas();
        $router->render('auth/confirmar-cuenta', [
            'alertas' => $alertas
    ]);

    }    
} 
?>