<?php
    namespace Classes;

    use PHPMailer\PHPMailer\PHPMailer;

    class Email{
        public $email;
        public $nombre;
        public $token;

        public function __construct($email, $nombre, $token){
            $this->email = $email;
            $this->nombre = $nombre;
            $this->token = $token;
        }

        public function enviarConfirmacion(){
            //crear el objeto de email
            require("vendor/phpmailer/phpmailer/src/PHPMailer.php");
            require("vendor/phpmailer/phpmailer/src/SMTP.php");            
            $mail = new PHPMailer();
            $mail->isSMTP();
            $mail->Host = $_ENV['EMAIL_HOST'] ;
            $mail->SMTPAuth = true;
            $mail->Port=$_ENV['EMAIL_PORT'];
            $mail->Username=$_ENV['EMAIL_USER'];
            $mail->Password=$_ENV['EMAIL_PASS'];
            $mail->setFrom('leonardocastro@hotmail.com'); //quien envia
            $mail->addAddress('desarrollo@gigasoft.com.co');
            $mail->Subject = 'Confirma Tu Cuenta';
            //set html
            $mail->isHTML(true);
            $mail->CharSet="UTF-8";
            $contenido="<html>";
            $contenido.="<p><strong>Hola " . $this->nombre  . "</string> Has creado tu cuenta en Giga solo debe confirmarla precionando el siguiente enlace</p>";
            $contenido.="<p>Presiona Aqui <a href='" .  $_ENV['APP_URL'] . "/confirmar-cuenta?token=" .$this->token  . "'>Confirmar Cuenta</a></p>";
            $contenido.="<p>Si no slolicito esta cuenta puede ignorar este mensaje</p>";
            $contenido.="</html>";
            $mail->Body = $contenido;

            //ENVIAR EMAIL
            $mail->send();
        }
        public function enviarInstrucciones(){
            //crear el objeto de email
            require("vendor/phpmailer/phpmailer/src/PHPMailer.php");
            require("vendor/phpmailer/phpmailer/src/SMTP.php");            
            $mail = new PHPMailer();
            $mail->isSMTP();
            $mail->Host = $_ENV['EMAIL_HOST'] ;
            $mail->SMTPAuth = true;
            $mail->Port=$_ENV['EMAIL_PORT'];
            $mail->Username=$_ENV['EMAIL_USER'];
            $mail->Password=$_ENV['EMAIL_PASS'];
            $mail->setFrom('leonardocastro@hotmail.com'); //quien envia
            $mail->addAddress('desarrollo@gigasoft.com.co');
            $mail->Subject = 'Reestablecer Paswword';
            //set html
            $mail->isHTML(true);
            $mail->CharSet="UTF-8";
            $contenido="<html>";
            $contenido.="<p><strong>Hola " . $this->nombre  . "</string> Has solicitado reestablecer password el siguiente enlace</p>";
            $contenido.="<p>Presiona Aqui <a href='" .  $_ENV['APP_URL'] . "/recuperar?token=" .$this->token  . "'>Reestablecer Password</a></p>";
            $contenido.="<p>Si no slolicito esta cuenta puede ignorar este mensaje</p>";
            $contenido.="</html>";
            $mail->Body = $contenido;

            //ENVIAR EMAIL
            $mail->send();

        }


    }



?>