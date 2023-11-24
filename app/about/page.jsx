import Image from "next/image";
import Link from "next/link";

const AboutUs = () => {
  return (
    <div>
      <div className="hero h-screen bg-base-200 overflow-y-hidden">
        <div className="hero-content flex-col lg:flex-row">
          <Image
            src="/product.jpg"
            width={500}
            height={500}
            alt="Picture of the author"
          />
          <div>
            <h1 className="text-5xl font-bold">About Us</h1>
            <p className="py-6">
              R S Automation has been established in year 1999 As A Group
              Company of Rutu.Young and dynamic Team members are always looking
              for better, reliable and effective solution to grow up our
              customers and better living environment.Wide experience in
              industrial automation.Trustful and positive relation with
              customers as well as suppliers, wide experience as a solution
              provider, Strong service support team and win win attitude makes R
              S Automation as a fast growing organization.We are largest
              supplier of PLC, HMI, Servo drives, AC drives, Motion controller
              based Automation Panels, Power panels, Synchronization panels,
              Heating control panels, etc.
            </p>
            <Link className="btn btn-primary" href="/">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
