<?php
    namespace Controllers;

use Model\Servicio;
use Model\cita;
use Model\CitaServicio;

    class APIController{
        public static function index(){
            $servicios = Servicio::all() ;
            echo json_encode($servicios);
            //debuguear($servicios);
        }

        public static function guardar(){
/*
            $respuesta = [
                'mensaje' => "todo ok"
            ];
            echo json_encode($respuesta);
*/          


            $cita = new Cita($_POST);
            $resultado = $cita->guardar();
            //Almacena la cita y los servicios

            
            $id = $resultado['id'];
            

            $idServicios = explode(",", $_POST['servicios']) ;
            //almacena los servicios con el id delq cita
            foreach($idServicios as $idServicio){
                $args=[
                    'citaId' => $id,
                    'servicioId' => $idServicio
                ];
                $citaServicio = new CitaServicio($args);
                $citaServicio -> guardar();
            }
            //retornamos una respuesta
            
            echo json_encode(['resultado' => $resultado]);
            
        }

        public static function eliminar(){
            if ($_SERVER['REQUEST_METHOD'] === "POST") {
                $id=$_POST['id'];

                $cita=Cita::find($id);
                $cita->eliminar();
                header('Location:' . $_SERVER['HTTP_REFERER']);
            }
        }

    }



?>