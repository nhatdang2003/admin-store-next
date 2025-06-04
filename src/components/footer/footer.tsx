import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter } from "lucide-react";
import ScalableStoreLogo from "../ui/logo-store";

export function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="w-[200px]">
              <Link href="/">
                <ScalableStoreLogo />
              </Link>
            </div>
            <p className="text-sm">
              Điểm đến cho thời trang sành điệu của bạn.
            </p>
            <div className="space-y-2">
              <p className="text-sm">Email: contact@ezstore.com</p>
              <p className="text-sm">Điện thoại: 0123 456 789</p>
              <p className="text-sm">
                Địa chỉ: 1 Võ Văn Ngân, Quận Thủ Đức, TP. Hồ Chí Minh
              </p>
            </div>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-600 hover:text-gray-800">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-800">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-800">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Thông Tin</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-sm hover:underline">
                  Sản Phẩm
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm hover:underline">
                  Về Chúng Tôi
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm hover:underline">
                  Chính Sách Vận Chuyển
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-sm hover:underline">
                  Chính Sách Đổi Trả
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-sm hover:underline">
                  Hướng Dẫn Chọn Size
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Đăng Ký Nhận Tin</h3>
            <p className="text-sm mb-4">
              Đăng ký để nhận thông tin ưu đãi đặc biệt và các deal hấp dẫn.
            </p>
            <form className="space-y-2">
              <Input type="email" placeholder="Địa chỉ email của bạn" />
              <Button type="submit" className="w-full">
                Đăng Ký
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} EzStore.
          </p>
        </div>
      </div>
    </footer>
  );
}
