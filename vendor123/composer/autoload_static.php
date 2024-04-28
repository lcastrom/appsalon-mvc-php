<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit1d5927750a94025eb4caab52d684676d
{
    public static $prefixLengthsPsr4 = array (
        'V' => 
        array (
            'Vendor\\Composer\\' => 16,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Vendor\\Composer\\' => 
        array (
            0 => __DIR__ . '/../..' . '/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit1d5927750a94025eb4caab52d684676d::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit1d5927750a94025eb4caab52d684676d::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit1d5927750a94025eb4caab52d684676d::$classMap;

        }, null, ClassLoader::class);
    }
}
