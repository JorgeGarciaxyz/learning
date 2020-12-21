require "spec_helper"
require "signup"

describe Signup do
  let(:account) { double ("account") }
  let(:user) { double ("user") }

  before do
    allow(Account).to receive(:create!).and_return(account)
    allow(User).to receive(:create!).and_return(user)
  end

  describe "#save" do
    it "creates an account with one user" do
      signup = Signup.new(email: "user@example.com", account_name: "Example")

      expect(Account).to receive(:create!)
      expect(User).to receive(:create!)

      signup.save
    end
  end

  describe "#user" do
    it "returns the user created by #save" do
      signup = Signup.new(
        email: "user@example.com", account_name: "Example"
      ).tap(&:save)

      expect(signup.user).to eq(user)
    end
  end
end
