name := "SwFinanceApi"

version := "1.0"

lazy val `swfinanceapi` = (project in file(".")).enablePlugins(PlayScala, SbtWeb)

scalaVersion := "2.11.7"

libraryDependencies ++= Seq(jdbc, cache, ws, specs2 % Test)

libraryDependencies ++= Seq(
  "org.webjars" %% "webjars-play" % "2.4.0-1",
  "org.webjars" % "react" % "15.3.1",
  "org.webjars.npm" % "react-dom" % "15.3.1",
  "org.webjars" % "superagent" % "1.4.0"
)

unmanagedResourceDirectories in Test <+= baseDirectory(_ / "target/web/public/test")

resolvers += "scalaz-bintray" at "https://dl.bintray.com/scalaz/releases"  